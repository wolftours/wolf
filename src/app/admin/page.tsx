import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isAdminSessionTokenValid } from "@/lib/admin-auth";
import { formatMoney } from "@/lib/booking";
import { getAdultPackagePrice, getServiceFee } from "@/lib/pricing";
import { getStripeSettingsStatus } from "@/lib/stripe-settings";
import { cities, getAllBookableProducts, museums } from "@/lib/travel-data";
import {
  clearStripeSettingsAction,
  saveStripeSettingsAction,
  setOrderSentAction,
  syncStripeSessionAction,
} from "./actions";
import { listWolfToursClosedSlots, listWolfToursOrders } from "@/lib/wolftours-db";
import AdminAvailabilityCalendar from "./AdminAvailabilityCalendar";
import styles from "./admin.module.css";

const ADMIN_TABS = ["orders", "products", "times", "payments"] as const;
type AdminTab = (typeof ADMIN_TABS)[number];
const TAB_LABELS: Record<AdminTab, string> = {
  orders: "Orders",
  products: "Products",
  times: "Time slots",
  payments: "Payments",
};
const VATICAN_SITE_PRODUCT_SLUGS = new Set([
  "vatican-sistine-chapel-entry",
  "private-vatican-museums-tour",
]);
const SAGRADA_SITE_PRODUCT_SLUGS = new Set([
  "sagrada-standard-admission",
  "sagrada-basilica",
  "sagrada-towers",
  "sagrada-audioguide-ticket",
]);
const SITE_FILTERS = ["all", "wolftours", "vaticanentry", "sagradaentry"] as const;
type SiteFilter = (typeof SITE_FILTERS)[number];

function getOrderSiteKey(order: { product_slug: string; site_key?: string | null }) {
  if (order.site_key) {
    return order.site_key;
  }

  if (VATICAN_SITE_PRODUCT_SLUGS.has(order.product_slug)) {
    return "vaticanentry";
  }

  if (SAGRADA_SITE_PRODUCT_SLUGS.has(order.product_slug)) {
    return "sagradaentry";
  }

  return "wolftours";
}

function getOrderSiteLabel(order: { product_slug: string; site_key?: string | null }) {
  const siteKey = getOrderSiteKey(order);

  if (siteKey === "vaticanentry") {
    return "Vatican site";
  }

  if (siteKey === "sagradaentry") {
    return "Sagrada site";
  }

  return "WolfTours";
}

function getDateFilter(value?: string) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : "";
}

function getOrderCreatedLabel(createdAt: string) {
  return new Intl.DateTimeFormat("hu-HU", {
    timeZone: "Europe/Budapest",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(createdAt));
}

type PageProps = {
  searchParams?: Promise<{
    date?: string;
    error?: string;
    productKey?: string;
    site?: string;
    tab?: string;
  }>;
};

export default async function AdminPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  const authenticated = isAdminSessionTokenValid(session);

  if (!authenticated) {
    return (
      <main className={styles.page}>
        <section className={styles.loginShell}>
          <header className={styles.loginHeader}>
            <p className={styles.eyebrow}>WolfTours admin</p>
            <h1>Admin panel</h1>
            <p>Simple password access. Supabase integration can come later.</p>
          </header>

          <form className={styles.loginForm} action="/admin/login" method="post">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
            {params.error ? (
              <p className={styles.error}>Invalid password. Try again.</p>
            ) : null}
            <button type="submit">Enter dashboard</button>
          </form>

          <Link className={styles.backLink} href="/">
            Back to website
          </Link>
        </section>
      </main>
    );
  }

  const products = getAllBookableProducts();
  const selectedOrderDate = getDateFilter(params.date);
  const selectedSite = SITE_FILTERS.includes(params.site as SiteFilter)
    ? (params.site as SiteFilter)
    : "all";
  const orders = await listWolfToursOrders({
    purchaseDate: selectedOrderDate,
    siteKey: selectedSite,
  });
  const closedSlots = await listWolfToursClosedSlots();
  const stripeSettings = await getStripeSettingsStatus();
  const visibleOrders = orders;
  const visibleOrdersTotal = visibleOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0,
  );
  const visibleAdults = visibleOrders.reduce((sum, order) => sum + order.adults, 0);
  const activeTab: AdminTab = ADMIN_TABS.includes(params.tab as AdminTab)
    ? (params.tab as AdminTab)
    : "orders";

  return (
    <main className={styles.adminApp}>
      <aside className={styles.adminSidebar}>
        <div>
          <p className={styles.adminBrand}>WolfTours</p>
          <p className={styles.adminSubtitle}>Admin Dashboard</p>
        </div>

        <nav className={styles.adminNav} aria-label="Admin sections">
          <p className={styles.adminNavLabel}>Management</p>
          <Link
            href="/admin?tab=orders"
            className={`${styles.adminNavItem} ${
              activeTab === "orders" ? styles.adminNavItemActive : ""
            }`}
          >
            <span className={styles.adminNavIcon} aria-hidden="true">☰</span>
            Orders
          </Link>
          <Link
            href="/admin?tab=products"
            className={`${styles.adminNavItem} ${
              activeTab === "products" ? styles.adminNavItemActive : ""
            }`}
          >
            <span className={styles.adminNavIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4.75 7.75 12 3.75l7.25 4-7.25 4-7.25-4Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.75 7.75v8.5L12 20.25l7.25-4v-8.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 11.75v8.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Products
          </Link>
          <Link
            href="/admin?tab=times"
            className={`${styles.adminNavItem} ${
              activeTab === "times" ? styles.adminNavItemActive : ""
            }`}
          >
            <span className={styles.adminNavIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21.25a9.25 9.25 0 1 0 0-18.5 9.25 9.25 0 0 0 0 18.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 7.5v5.1l3.4 2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Time slots
          </Link>
          <Link
            href="/admin?tab=payments"
            className={`${styles.adminNavItem} ${
              activeTab === "payments" ? styles.adminNavItemActive : ""
            }`}
          >
            <span className={styles.adminNavIcon} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M4.75 7.25h14.5v9.5H4.75v-9.5Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.75 10.25h14.5M8 14h3.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            Payments
          </Link>
        </nav>

        <div className={styles.adminSidebarStats}>
          <p>Museums: {museums.length}</p>
          <p>Cities: {cities.length}</p>
          <p>Products: {products.length}</p>
        </div>

        <form action="/admin/logout" method="post" className={styles.adminLogoutForm}>
          <button className={styles.adminLogout} type="submit">
            Log out
          </button>
        </form>
      </aside>

      <section className={styles.adminMain}>
        <header className={styles.adminTopbar}>
          <div>
            <h1>Dashboard</h1>
            <p>WolfTours control center</p>
          </div>

          <div className={styles.adminTopActions}>
            <input type="search" placeholder="Search" />
            <span>Admin</span>
          </div>
        </header>

        <div className={styles.adminContent}>
          <div className={styles.adminSectionTitle}>
            <p>Current section</p>
            <h2>{TAB_LABELS[activeTab]}</h2>
          </div>

          {params.error ? (
            <p className={styles.adminActionError}>{params.error}</p>
          ) : null}

          <div className={styles.adminCards}>
            <article>
              <p>Filtered revenue</p>
              <strong>{formatMoney(visibleOrdersTotal)}</strong>
            </article>
            <article>
              <p>Adult tickets</p>
              <strong>{visibleAdults}</strong>
            </article>
            <article>
              <p>Bookable products</p>
              <strong>{products.length}</strong>
            </article>
            <article>
              <p>Orders</p>
              <strong>{visibleOrders.length}</strong>
            </article>
          </div>

          {activeTab === "orders" ? (
            <section className={styles.adminPanel}>
              <h3>Orders</h3>
              <p className={styles.adminPanelIntro}>
                Live WolfTours bookings from Supabase. Use the sent toggle once vouchers are delivered.
              </p>
              <form className={styles.adminSyncForm} action="/admin" method="get">
                <label htmlFor="order-date">Filter orders by purchase date</label>
                <div className={styles.adminSyncRow}>
                  <input type="hidden" name="tab" value="orders" />
                  <input
                    id="order-date"
                    name="date"
                    type="date"
                    defaultValue={selectedOrderDate}
                  />
                  <select name="site" defaultValue={selectedSite}>
                    <option value="all">All sites</option>
                    <option value="wolftours">WolfTours</option>
                    <option value="vaticanentry">Vatican site</option>
                    <option value="sagradaentry">Sagrada site</option>
                  </select>
                  <button type="submit">Filter</button>
                  {selectedOrderDate || selectedSite !== "all" ? (
                    <Link href="/admin?tab=orders">Clear</Link>
                  ) : null}
                </div>
              </form>
              <form className={styles.adminSyncForm} action={syncStripeSessionAction}>
                <label htmlFor="stripe-session-id">Recover paid Stripe checkout</label>
                <div className={styles.adminSyncRow}>
                  <input
                    id="stripe-session-id"
                    name="sessionId"
                    placeholder="cs_live_..."
                    type="text"
                  />
                  <button type="submit">Sync order</button>
                </div>
              </form>
              <div className={styles.adminTableWrap}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Site</th>
                      <th>Product</th>
                      <th>Ordered</th>
                      <th>Visit date</th>
                      <th>Time</th>
                      <th>Adult</th>
                      <th>Child</th>
                      <th>Total</th>
                      <th>Sent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleOrders.length > 0 ? (
                      visibleOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.reference}</td>
                          <td>{order.customer_name}</td>
                          <td>{order.customer_email}</td>
                          <td>{order.customer_phone}</td>
                          <td>
                            <span className={styles.adminSiteBadge}>
                              {getOrderSiteLabel(order)}
                            </span>
                          </td>
                          <td>{order.product_title}</td>
                          <td>{getOrderCreatedLabel(order.created_at)}</td>
                          <td>{order.visit_date}</td>
                          <td>{order.entry_time}</td>
                          <td>{order.adults}</td>
                          <td>{order.children}</td>
                          <td>{formatMoney(Number(order.total))}</td>
                          <td>
                            <form action={setOrderSentAction}>
                              <input type="hidden" name="orderId" value={order.id} />
                              <input
                                type="hidden"
                                name="sent"
                                value={order.sent ? "false" : "true"}
                              />
                              <button
                                className={
                                  order.sent
                                    ? styles.adminStatusButtonSent
                                    : styles.adminStatusButton
                                }
                                type="submit"
                                title={order.sent ? "Mark as not sent" : "Mark as sent"}
                              >
                                {order.sent ? "✓" : "X"}
                              </button>
                            </form>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={13}>No orders yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === "products" ? (
            <section className={styles.adminPanel}>
              <h3>Products</h3>
              <p className={styles.adminPanelIntro}>
                Current products from travel data. Good starting point before CMS/Supabase.
              </p>
              <div className={styles.adminTableWrap}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>City</th>
                      <th>Museum</th>
                      <th>Title</th>
                      <th>Slug</th>
                      <th>Official ticket</th>
                      <th>Service fee</th>
                      <th>Package from</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={`${product.museumSlug}-${product.slug}`}>
                        <td>{product.city}</td>
                        <td>{product.museumName}</td>
                        <td>{product.title}</td>
                        <td>{product.slug}</td>
                        <td>{formatMoney(product.adultPrice)}</td>
                        <td>{formatMoney(getServiceFee(product))}</td>
                        <td>{formatMoney(getAdultPackagePrice(product))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {activeTab === "times" ? (
            <section className={styles.adminPanel}>
              <h3>Time slot setup</h3>
              <p className={styles.adminPanelIntro}>
                Choose a product, browse the calendar, and close whole days or
                individual entry times. Closed availability disappears from the
                booking widget.
              </p>
              <AdminAvailabilityCalendar
                closedSlots={closedSlots}
                initialDate={params.date}
                initialProductKey={params.productKey}
                products={products}
              />
            </section>
          ) : null}

          {activeTab === "payments" ? (
            <section className={styles.adminPanel}>
              <h3>Stripe payments</h3>
              <p className={styles.adminPanelIntro}>
                Change which Stripe account receives new checkout payments.
                Saved keys are used server-side only; the full secret key is
                never printed back in the admin panel.
              </p>

              <div className={styles.adminPaymentGrid}>
                <article className={styles.adminPaymentStatus}>
                  <p>Active source</p>
                  <strong>
                    {stripeSettings.source === "database"
                      ? "Admin saved keys"
                      : stripeSettings.source === "environment"
                        ? "Environment keys"
                        : "Not configured"}
                  </strong>
                  <dl>
                    <div>
                      <dt>Secret key</dt>
                      <dd>{stripeSettings.maskedSecretKey ?? "Missing"}</dd>
                    </div>
                    <div>
                      <dt>Publishable key</dt>
                      <dd>{stripeSettings.maskedPublishableKey ?? "Missing"}</dd>
                    </div>
                  </dl>
                  {stripeSettings.setupError ? (
                    <p className={styles.adminPaymentWarning}>
                      {stripeSettings.setupError}
                    </p>
                  ) : null}
                </article>

                <article>
                  <h4>Save new Stripe keys</h4>
                  <p className={styles.adminHelpText}>
                    Paste a new `sk_live_...` secret key to switch new checkout
                    sessions to that Stripe account. Leave a field empty to keep
                    the current saved value.
                  </p>
                  <form
                    className={styles.adminSlotForm}
                    action={saveStripeSettingsAction}
                  >
                    <label>
                      Secret key
                      <input
                        type="password"
                        name="secretKey"
                        placeholder="sk_live_..."
                        autoComplete="off"
                      />
                    </label>
                    <label>
                      Publishable key
                      <input
                        type="password"
                        name="publishableKey"
                        placeholder="pk_live_..."
                        autoComplete="off"
                      />
                    </label>
                    <button className={styles.adminPrimaryButton} type="submit">
                      Save Stripe keys
                    </button>
                  </form>
                </article>

                <article>
                  <h4>Use environment keys</h4>
                  <p className={styles.adminHelpText}>
                    Remove the admin-saved Stripe keys and fall back to
                    `STRIPE_SECRET_KEY` from Vercel/environment variables.
                  </p>
                  <form action={clearStripeSettingsAction}>
                    <button className={styles.adminDangerButton} type="submit">
                      Clear saved Stripe keys
                    </button>
                  </form>
                </article>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
