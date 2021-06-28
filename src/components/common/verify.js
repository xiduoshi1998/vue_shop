// 手机验证规则
let checkmobile = (rule, value, callback) => {
    let regmobile = /^1[3|4|5|7|8][0-9]{9}$/
    if (regmobile.test(value)) {
        return callback()
    }
    callback(new Error('请输入合法手机号'))
}
//邮箱验证规则
let checkEmail = (rule, value, callback) => {
    let regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
    if (regEmail.test(value)) {
        return callback()
    }
    callback(new Error('请输入合法的邮箱'))

}

export let verify = {
    addFromRules: {
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
            { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
            { required: true, message: '请输入手机', trigger: 'blur' },
            { validator: checkmobile, trigger: "blur" }
        ],
        role: [
            { required: true, message: '请输入描述', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
    }
}
