-- Aeroflow Database Schema
-- PostgreSQL 15

-- Users
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       TEXT UNIQUE NOT NULL,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- User Behavioral Profiles
CREATE TABLE user_profiles (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
    schedule_load       TEXT DEFAULT 'medium',     -- low / medium / high
    budget_weekly       NUMERIC(10,2) DEFAULT 1500,
    preferred_cuisine   TEXT[],
    dietary_flags       TEXT[],                    -- vegetarian, vegan, gluten-free
    sleep_start_hour    INT DEFAULT 23,
    wake_hour           INT DEFAULT 7,
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE orders (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    total_amount    NUMERIC(10,2) NOT NULL,
    ai_confidence   NUMERIC(4,3),                 -- 0.000 to 1.000
    triggered_by    TEXT DEFAULT 'user',          -- user | ai_prediction | auto_replenish
    status          TEXT DEFAULT 'placed',        -- placed | confirmed | delivered | cancelled
    placed_at       TIMESTAMPTZ DEFAULT NOW(),
    delivered_at    TIMESTAMPTZ
);

-- Order Items
CREATE TABLE order_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
    item_name   TEXT NOT NULL,
    restaurant  TEXT NOT NULL,
    price       NUMERIC(10,2) NOT NULL,
    quantity    INT DEFAULT 1,
    tag         TEXT DEFAULT 'added'              -- predicted | added | auto-replenish
);

-- Living Cart
CREATE TABLE carts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    last_refreshed  TIMESTAMPTZ DEFAULT NOW(),
    ai_insight      TEXT
);

CREATE TABLE cart_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id     UUID REFERENCES carts(id) ON DELETE CASCADE,
    item_name   TEXT NOT NULL,
    restaurant  TEXT NOT NULL,
    price       NUMERIC(10,2) NOT NULL,
    quantity    INT DEFAULT 1,
    tag         TEXT DEFAULT 'predicted',
    nutrition   TEXT
);

-- Grocery Depletion Forecasts
CREATE TABLE depletion_forecasts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID REFERENCES users(id),
    item_name           TEXT NOT NULL,
    predicted_depletion DATE NOT NULL,
    auto_order          BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Agent Decisions (Audit Log)
CREATE TABLE agent_decisions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    agent_name      TEXT NOT NULL,
    recommendation  TEXT NOT NULL,
    score           NUMERIC(4,3),
    reasoning       TEXT,
    final_score     NUMERIC(4,3),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_agent_decisions_user ON agent_decisions(user_id);
CREATE INDEX idx_depletion_user ON depletion_forecasts(user_id);
