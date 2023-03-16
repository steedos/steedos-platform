const GeetestConfig = Object.freeze({
    GEETEST_ID: "c9c4facd1a6feeb80802222cbb74ca8e", //process.env.STEEDOS_CAPTCHA_GEETEST_ID
    GEETEST_KEY: "e4e298788aa8c768397639deb9b249a9",
    REDIS_HOST: "127.0.0.1",
    REDIS_PORT: "6379",
    BYPASS_URL: "http://bypass.geetest.com/v1/bypass_status.php",
    CYCLE_TIME: 10,
    GEETEST_BYPASS_STATUS_KEY: "gt_server_bypass_status"
})

module.exports = GeetestConfig
