-- Newsletter: subscribers, posts, per-email delivery tracking

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  resend_contact_id TEXT,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS newsletter_subscribers_status_idx
  ON newsletter_subscribers (status);

CREATE TABLE IF NOT EXISTS newsletter_posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  first_published_at TIMESTAMPTZ,
  last_publish_at TIMESTAMPTZ,
  publish_count INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS newsletter_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL REFERENCES newsletter_posts (slug) ON DELETE CASCADE,
  subscriber_id UUID NOT NULL REFERENCES newsletter_subscribers (id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'sent', 'delivered', 'failed', 'bounced', 'complained', 'skipped_unsubscribed'
  )),
  resend_email_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (post_slug, email)
);

CREATE INDEX IF NOT EXISTS newsletter_deliveries_post_status_idx
  ON newsletter_deliveries (post_slug, status);

CREATE INDEX IF NOT EXISTS newsletter_deliveries_subscriber_idx
  ON newsletter_deliveries (subscriber_id);

CREATE INDEX IF NOT EXISTS newsletter_deliveries_resend_email_id_idx
  ON newsletter_deliveries (resend_email_id)
  WHERE resend_email_id IS NOT NULL;
