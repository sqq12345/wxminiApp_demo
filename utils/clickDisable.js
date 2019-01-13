function btnDisabled(self) {
    self.setData({
        btnDisabled: true
    })
    setTimeout(function () {
        self.setData({
            btnDisabled: false
        })
    }, 1500)
}
module.exports = {
    btnDisabled: btnDisabled
}
