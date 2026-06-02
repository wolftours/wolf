import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, isAdminSessionTokenValid } from "@/lib/admin-auth";
import {
  formatMoney,
  getAvailableTimeSlots,
  getMinBookableDate,
  TIME_SLOTS,
} from "@/lib/booking";
import { getAdultPackagePrice, getServiceFee } from "@/lib/pricing";
import { cities, getAllBookableProducts, museums } from "@/lib/travel-data";
import {
  closeProductDaysAction,
  closeSlotAction,
  openProductDayAction,
  openSlotAction,
  setOrderSentAction,
} from "./actions";
import {
  listWolfToursClosedSlots,
  listWolfToursOrders,
  type WolfToursClosedSlot,
} from "@/lib/wolftours-db";
import styles from "./admin.module.css";

const ADMIN_TABS = ["orders", "products", "times"] as const;
type AdminTab = (typeof ADMIN_TABS)[number];
const TAB_LABELS: Record<AdminTab, string> = {
  orders: "Orders",
  products: "Products",
  times: "Time slots",
};

type PageProps = {
  searchParams?: Promise<{ error?: string; tab?: string }>;
};

type ClosedProductDay = {
  key: string;
  museum_slug: string;
  product_slug: string;
  visit_date: string;
  closedSlotCount: number;
};

function getClosedProductDays(closedSlots: WolfToursClosedSlot[]) {
  const groupedSlots = new Map<string, Set<string>>();

  for (const slot of closedSlots) {
    const key = `${slot.museum_slug}:${slot.product_slug}:${slot.visit_date}`;
    const entryTimes = groupedSlots.get(key) ?? new Set<string>();
    entryTimes.add(slot.entry_time);
    groupedSlots.set(key, entryTimes);
  }

  return Array.from(groupedSlots.entries())
    .map(([key, entryTimes]) => {
      const [museumSlug, productSlug, visitDate] = key.split(":");
      const availableSlots = getAvailableTimeSlots(visitDate);
      const isFullDayClosed =
        availableSlots.length > 0 &&
        availableSlots.every((slot) => entryTimes.has(slot));

      if (!isFullDayClosed) {
        return null;
      }

      return {
        key,
        museum_slug: museumSlug,
        product_slug: productSlug,
        visit_date: visitDate,
        closedSlotCount: availableSlots.length,
      } satisfies ClosedProductDay;
    })
    .filter((day): day is ClosedProductDay => Boolean(day));
}

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
  const orders = await listWolfToursOrders();
  const closedSlots = await listWolfToursClosedSlots();
  const closedProductDays = getClosedProductDays(closedSlots);
  const closedProductDayKeys = new Set(closedProductDays.map((day) => day.key));
  const individualClosedSlots = closedSlots.filter(
    (slot) =>
      !closedProductDayKeys.has(
        `${slot.museum_slug}:${slot.product_slug}:${slot.visit_date}`,
      ),
  );
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
              <p>Museums</p>
              <strong>{museums.length}</strong>
            </article>
            <article>
              <p>Cities</p>
              <strong>{cities.length}</strong>
            </article>
            <article>
              <p>Bookable products</p>
              <strong>{products.length}</strong>
            </article>
            <article>
              <p>Orders</p>
              <strong>{orders.length}</strong>
            </article>
          </div>

          {activeTab === "orders" ? (
            <section className={styles.adminPanel}>
              <h3>Orders</h3>
              <p className={styles.adminPanelIntro}>
                Live WolfTours bookings from Supabase. Use the sent toggle once vouchers are delivered.
              </p>
              <div className={styles.adminTableWrap}>
                <table className={styles.adminTable}>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Product</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Adult</th>
                      <th>Child</th>
                      <th>Total</th>
                      <th>Sent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.reference}</td>
                          <td>{order.customer_name}</td>
                          <td>{order.customer_email}</td>
                          <td>{order.customer_phone}</td>
                          <td>{order.product_title}</td>
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
                        <td colSpan={11}>No orders yet.</td>
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
                Close full days or specific entry times per product. Closed
                availability disappears from the booking widget.
              </p>
              <div className={styles.adminTimeGrid}>
                <article>
                  <h4>Close full days</h4>
                  <p className={styles.adminFormHint}>
                    Pick a product and a date range. Every bookable slot on
                    those days will be closed for that product.
                  </p>
                  <form className={styles.adminSlotForm} action={closeProductDaysAction}>
                    <label>
                      Product
                      <select name="productKey" defaultValue="" required>
                        <option value="" disabled>
                          Choose product
                        </option>
                        {products.map((product) => (
                          <option
                            key={`${product.museumSlug}:${product.slug}`}
                            value={`${product.museumSlug}:${product.slug}`}
                          >
                            {product.museumName} · {product.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className={styles.adminDateFields}>
                      <label>
                        Start date
                        <input
                          type="date"
                          name="startDate"
                          min={getMinBookableDate()}
                          required
                        />
                      </label>
                      <label>
                        End date
                        <input
                          type="date"
                          name="endDate"
                          min={getMinBookableDate()}
                        />
                      </label>
                    </div>
                    <button className={styles.adminPrimaryButton} type="submit">
                      Close full days
                    </button>
                  </form>
                </article>

                <article>
                  <h4>Close a slot</h4>
                  <form className={styles.adminSlotForm} action={closeSlotAction}>
                    <label>
                      Product
                      <select name="productKey" defaultValue="" required>
                        <option value="" disabled>
                          Choose product
                        </option>
                        {products.map((product) => (
                          <option
                            key={`${product.museumSlug}:${product.slug}`}
                            value={`${product.museumSlug}:${product.slug}`}
                          >
                            {product.museumName} · {product.title}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Visit date
                      <input
                        type="date"
                        name="visitDate"
                        min={getMinBookableDate()}
                        required
                      />
                    </label>
                    <label>
                      Entry time
                      <select name="entryTime" required>
                        {TIME_SLOTS.map((slot) => (
                          <option value={slot} key={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button className={styles.adminPrimaryButton} type="submit">
                      Close slot
                    </button>
                  </form>
                </article>

                <article>
                  <h4>Closed full days</h4>
                  <div className={styles.adminClosedSlotList}>
                    {closedProductDays.length > 0 ? (
                      closedProductDays.map((day) => {
                        const product = products.find(
                          (item) =>
                            item.museumSlug === day.museum_slug &&
                            item.slug === day.product_slug,
                        );

                        return (
                          <div className={styles.adminClosedSlot} key={day.key}>
                            <div>
                              <strong>{product?.title ?? day.product_slug}</strong>
                              <span>
                                {day.visit_date} · all {day.closedSlotCount} slots
                              </span>
                            </div>
                            <form action={openProductDayAction}>
                              <input
                                type="hidden"
                                name="museumSlug"
                                value={day.museum_slug}
                              />
                              <input
                                type="hidden"
                                name="productSlug"
                                value={day.product_slug}
                              />
                              <input
                                type="hidden"
                                name="visitDate"
                                value={day.visit_date}
                              />
                              <button type="submit">Open day</button>
                            </form>
                          </div>
                        );
                      })
                    ) : (
                      <p className={styles.adminEmpty}>No full days closed yet.</p>
                    )}
                  </div>
                </article>

                <article>
                  <h4>Closed individual slots</h4>
                  <div className={styles.adminClosedSlotList}>
                    {individualClosedSlots.length > 0 ? (
                      individualClosedSlots.map((slot) => {
                        const product = products.find(
                          (item) =>
                            item.museumSlug === slot.museum_slug &&
                            item.slug === slot.product_slug,
                        );

                        return (
                          <div className={styles.adminClosedSlot} key={slot.id}>
                            <div>
                              <strong>{product?.title ?? slot.product_slug}</strong>
                              <span>
                                {slot.visit_date} · {slot.entry_time}
                              </span>
                            </div>
                            <form action={openSlotAction}>
                              <input
                                type="hidden"
                                name="closedSlotId"
                                value={slot.id}
                              />
                              <button type="submit">Open</button>
                            </form>
                          </div>
                        );
                      })
                    ) : (
                      <p className={styles.adminEmpty}>
                        No individual slots closed yet.
                      </p>
                    )}
                  </div>
                </article>
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
