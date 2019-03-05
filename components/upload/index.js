Component({
    externalClasses: ['wux-class'],
    properties: {
        max: {
            type: Number,
            value: -1,
            observer: 'updated',
        },
        count: {
            type: Number,
            value: 9,
            observer: 'updated',
        },
        sizeType: {
            type: Array,
            value: ['original', 'compressed'],
        },
        sourceType: {
            type: Array,
            value: ['album', 'camera'],
        },
        url: {
            type: String,
            value: '',
        },
        name: {
            type: String,
            value: 'file',
        },
        header: {
            type: Object,
            value: {},
        },
        formData: {
            type: Object,
            value: {},
        },
        uploaded: {
            type: Boolean,
            value: true,
        },
        disabled: {
            type: Boolean,
            value: false,
        },
        progress: {
            type: Boolean,
            value: false,
        },
        listType: {
            type: String,
            value: 'text',
        },
        defaultFileList: {
            type: Array,
            value: [],
        },
        fileList: {
            type: Array,
            value: [],
            observer(newVal) {
                if (this.data.controlled) {
                    this.setData({
                        uploadFileList: newVal,
                    })
                }
            },
        },
        controlled: {
            type: Boolean,
            value: false,
        },
        showUploadList: {
            type: Boolean,
            value: true,
        },
        showRemoveIcon: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        uploadMax: -1,
        uploadCount: 9,
        uploadFileList: [],
    },
    methods: {
        /**
         * 计算最多可以选择的图片张数
         */
        updated() {
            const { count, max } = this.data
            const { uploadMax, uploadCount } = this.calcValue(count, max)

            // 判断是否需要更新
            if (this.data.uploadMax !== uploadMax || this.data.uploadCount !== uploadCount) {
                this.setData({
                    uploadMax,
                    uploadCount,
                })
            }
        },
        /**
         * 计算最多可以选择的图片张数
         */
        calcValue(count, max) {
            const realCount = parseInt(count)
            const uploadMax = parseInt(max) > -1 ? parseInt(max) : -1
            let uploadCount = realCount

            // 限制总数时
            if (uploadMax !== -1 && uploadMax <= 9 && realCount > uploadMax) {
                uploadCount = uploadMax
            }

            return {
                uploadMax,
                uploadCount,
            }
        },
        /**
         * 从本地相册选择图片或使用相机拍照
         */
        onSelect() {
            const {
                uploadCount,
                uploadMax,
                sizeType,
                sourceType,
                uploaded,
                disabled,
                uploadFileList: fileList,
            } = this.data
            const { uploadCount: count } = this.calcValue(uploadCount, uploadMax - fileList.length)
            const success = (res) => {
                this.tempFilePaths = res.tempFilePaths.map((item) => ({ url: item, uid: this.getUid() }))
                this.triggerEvent('before', {...res, fileList })
                // 判断是否取消默认的上传行为
                if (uploaded) {
                    this.uploadFile()
                }
            }

            // disabled
            if (disabled) return

            wx.chooseImage({
                count,
                sizeType,
                sourceType,
                success,
            })
        },
        /**
         * 上传文件改变时的回调函数
         * @param {Object} info 文件信息
         */
        onChange(info = {}) {
            if (!this.data.controlled) {
                this.setData({
                    uploadFileList: info.fileList,
                })
            }

            this.triggerEvent('change', info)
        },
        /**
         * 开始上传文件的回调函数
         * @param {Object} file 文件对象
         */
        onStart(file) {
            const targetItem = {
                ...file,
                status: 'uploading',
            }

            this.onChange({
                file: targetItem,
                fileList: [...this.data.uploadFileList, targetItem],
            })
        },
        /**
         * 上传文件成功时的回调函数
         * @param {Object} file 文件对象
         * @param {Object} res 请求响应对象
         */
        onSuccess(file, res) {
            const fileList = [...this.data.uploadFileList]
            const index = fileList.map((item) => item.uid).indexOf(file.uid)

            if (index !== -1) {
                const targetItem = {
                    ...file,
                    status: 'done',
                    res,
                }
                const info = {
                    file: targetItem,
                    fileList,
                }

                // replace
                fileList.splice(index, 1, targetItem)

                this.triggerEvent('success', info)

                this.onChange(info)
            }
        },
        /**
         * 上传文件失败时的回调函数
         * @param {Object} file 文件对象
         * @param {Object} res 请求响应对象
         */
        onFail(file, res) {
            const fileList = [...this.data.uploadFileList]
            const index = fileList.map((item) => item.uid).indexOf(file.uid)

            if (index !== -1) {
                const targetItem = {
                    ...file,
                    status: 'error',
                    res,
                }
                const info = {
                    file: targetItem,
                    fileList,
                }

                // replace
                fileList.splice(index, 1, targetItem)

                this.triggerEvent('fail', info)

                this.onChange(info)
            }
        },
        /**
         * 监听上传进度变化的回调函数
         * @param {Object} file 文件对象
         * @param {Object} res 请求响应对象
         */
        onProgress(file, res) {
            const fileList = [...this.data.uploadFileList]
            const index = fileList.map((item) => item.uid).indexOf(file.uid)

            if (index !== -1) {
                const targetItem = {
                    ...file,
                    progress: res.progress,
                    res,
                }
                const info = {
                    file: targetItem,
                    fileList,
                }

                // replace
                fileList.splice(index, 1, targetItem)

                this.triggerEvent('progress', info)

                this.onChange(info)
            }
        },
        /**
         * 上传文件，支持多图递归上传
         */
        uploadFile() {
            if (!this.tempFilePaths.length) return

            let { url, name, header, formData, disabled, progress } = this.data
            const file = this.tempFilePaths.shift()
            const { uid, url: filePath } = file
            // name = 'images'
            name = 'file'
            // if(!url) url = 'https://anfou.cc/api/basics/upload'
            if(!url) url = 'https://anfou.oss-cn-shanghai.aliyuncs.com'


            //oss上传文件夹路径
            const myDate = new Date()
            const date = myDate.getDate()<10 ? '0'+myDate.getDate() : myDate.getDate()
            const month = myDate.getMonth()+1 <10 ? '0'+(myDate.getMonth()+1) : myDate.getMonth()+1
            const nowDate = myDate.getFullYear() +""+ month +""+ date
            const fileName = new Date().getTime()+Math.floor(Math.random() * 1000)+"."+filePath.split('.').pop()
            const fileKey = 'anfou/' + nowDate + '/'+fileName
            //oss key
            const Base64 = require('Base64.js');
            require('hmac.js');
            require('sha1.js');
            const Crypto = require('crypto.js');
            var policyText = {
                "expiration": "2030-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
                "conditions": [
                    ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
                ]
            };
            const accesskey= '1U7fiB3iawSKJ495x2WkZvRx3tujjg';
            const policyBase64 = Base64.encode(JSON.stringify(policyText)),
                   message = policyBase64
            const bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true }) ;
            const signature = Crypto.util.bytesToBase64(bytes);
            formData= {
                name: filePath,
                key: fileKey,
                policy: policyBase64,
                OSSAccessKeyId: "RQaayt64TEEdGZto",
                success_action_status: "200", //让服务端返回200,不然，默认会返回204
                signature: signature,
            }

            if (!url || !filePath || disabled) return

            this.onStart(file)

            //debug
            // wx.showToast({
            //     title: url,
            //     icon: 'none',
            //     duration: 5000,
            //     mask: false,
            // });

            this.uploadTask[uid] = wx.uploadFile({
                url,
                filePath,
                name,
                formData,
                success: (res) => this.onSuccess(file, res),
                fail: (res) => this.onFail(file, res),
                complete: (res) => {
                    delete this.uploadTask[uid]
                    this.triggerEvent('complete', fileKey)
                    this.uploadFile()
                },
            })
            console.log("uploadFile",fileKey)

            // 判断是否监听上传进度变化
            if (progress) {
                this.uploadTask[uid].onProgressUpdate((res) => this.onProgress(file, res))
            }
        },
        /**
         * 点击文件时的回调函数
         * @param {Object} e 参数对象
         */
        onPreview(e) {
            this.triggerEvent('preview', {...e.currentTarget.dataset, fileList: this.data.uploadFileList })
        },
        /**
         * 点击删除图标时的回调函数
         * @param {Object} e 参数对象
         */
        onRemove(e) {
            const { file } = e.currentTarget.dataset
            const fileList = [...this.data.uploadFileList]
            const index = fileList.map((item) => item.uid).indexOf(file.uid)

            if (index !== -1) {
                const targetItem = {
                    ...file,
                    status: 'remove',
                }
                const info = {
                    file: targetItem,
                    fileList,
                }

                // delete
                fileList.splice(index, 1)

                this.triggerEvent('remove', {...e.currentTarget.dataset, ...info })

                this.onChange(info)
            }
        },
        /**
         * 中断上传任务
         * @param {String} uid 文件唯一标识
         */
        abort(uid) {
            const { uploadTask } = this

            if (uid) {
                if (uploadTask[uid]) {
                    uploadTask[uid].abort()
                    delete uploadTask[uid]
                }
            } else {
                Object.keys(uploadTask).forEach((uid) => {
                    if (uploadTask[uid]) {
                        uploadTask[uid].abort()
                        delete uploadTask[uid]
                    }
                })
            }
        },
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执行
     */
    created() {
        this.index = 0
        this.createdAt = Date.now()
        this.getUid = () => `wux-upload--${this.createdAt}-${++this.index}`
        this.uploadTask = {}
        this.tempFilePaths = []
    },
    /**
     * 组件生命周期函数，在组件实例进入页面节点树时执
     */
    attached() {
        const { defaultFileList, fileList, controlled } = this.data
        const uploadFileList = controlled ? fileList : defaultFileList

        this.setData({ uploadFileList })
    },
    /**
     * 组件生命周期函数，在组件实例被从页面节点树移除时执行
     */
    detached() {
        this.abort()
    },
})
