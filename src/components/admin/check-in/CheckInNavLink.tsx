import Link from 'next/link';

// Custom views do not show up in the admin nav on their own
export function CheckInNavLink() {
  return (
    <Link href="/admin/check-in" className="nav__link">
      <span className="nav__link-label">Megjelenés rögzítése</span>
    </Link>
  );
}
