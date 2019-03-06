function btnDisabled(self) {
    self.setData({
        btnDisabled: true
    })
    setTimeout(function () {
        self.setData({
            btnDisabled: false
        })
    }, 3000)
}
module.exports = {
    btnDisabled: btnDisabled
}
