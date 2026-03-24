
CREATE TABLE IF NOT EXISTS t_p31859391_gylekor_messenger_pr.otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(6) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '10 minutes',
  used BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_otp_phone ON t_p31859391_gylekor_messenger_pr.otp_codes(phone, used, expires_at);
