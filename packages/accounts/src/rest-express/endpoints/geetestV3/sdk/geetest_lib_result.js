// sdk lib包的返回结果信息。
class GeetestLibResult {
    constructor() {
        this.status = 0; // 成功失败的标识码，1表示成功，0表示失败
        this.data = ""; // 返回数据，json格式
        this.msg = ""; // 备注信息，如异常信息等
    }

    setAll(status, data, msg) {
        this.status = status;
        this.data = data;
        this.msg = msg;
    }

    toString() {
        return `GeetestLibResult{status=${this.status}, data=${this.data}, msg=${this.msg}}`;
    }
}

module.exports = GeetestLibResult;