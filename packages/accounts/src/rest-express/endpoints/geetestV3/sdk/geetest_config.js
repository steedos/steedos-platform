const GeetestConfig = Object.freeze({
    GEETEST_ID: process.env.STEEDOS_CAPTCHA_GEETEST_ID,
    GEETEST_KEY: process.env.STEEDOS_CAPTCHA_GEETEST_KEY,
    REDIS_HOST: "127.0.0.1",
    REDIS_PORT: "6379",
    BYPASS_URL: "http://bypass.geetest.com/v1/bypass_status.php",
    CYCLE_TIME: 10,
    GEETEST_BYPASS_STATUS_KEY: "gt_server_bypass_status"
})

module.exports = GeetestConfig
