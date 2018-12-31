/**
 * 
 * @param {表单值} form 
 * @param {验证配置} config
 */
export default function (form, config) {
    for (const field in config) {
        const value = form[field];
        const { name, require, max, min, regex, msg } = config[field];
        //非空
        if (require && (!value || value.length === 0)) {
            console.warn(name + '不能为空');
            wx.showToast({
                title: msg || name + '不能为空',
                icon: 'none',
                duration: 2000,
                mask: false,
            });
            return false;
        }
        //长度
        if (max && value && value.length > 0) {
            if (value.length > max) {
                console.warn(name + '不能超过' + max + '个字');
                wx.showToast({
                    title: msg || name + '不能超过' + max + '个字',
                    icon: 'none',
                    duration: 2000,
                    mask: false,
                });
                return false;
            }
        }
        //正则
        if (regex && value && value.length > 0) {
            if (!regex.test(value)) {
                console.warn(name + '格式不正确');
                wx.showToast({
                    title: msg || name + '格式不正确',
                    icon: 'none',
                    duration: 2000,
                    mask: false,
                });
                return false;
            }
        }
    }
    return true;
}