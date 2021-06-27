
export let methods = {

    async getUserList() {
        const { data: res } = await this.$http.get('users', {
            params: this.queryInfo
        })
        if (res.meta.status !== 200) {
            return this.$message.error('无法获取用户数据')
        }
        this.userlist = res.data.users
        this.total = res.data.total

    },

    // 监听 pagesize 改变的事件
    handleSizeChange(newsize) {
        this.queryInfo.pagesize = newsize
        console.log(newsize);
        this.getUserList()
    },

    // 监听页码植改变的事件
    handleCurrentChange(newpage) {
        this.queryInfo.pagenum = newpage
        this.getUserList()
    },

    // 监听开关的改变
    async userStateChanged(userinfo) {
        const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        if (res.meta.status !== 200) {
            userinfo.mg_state = !userinfo.mg_state
            return this.$message.error('用户状态失败')
        }
        this.$message.success('更新用户状态成功')
    },

    // 监听添加用户的关闭事件
    addDialogClosed() {
        this.$refs.addFromRef.resetFields()
    },

    // 点击添加用户
    adduser() {
        this.$refs.addFromRef.validate(async (valid) => {
            if (!valid) return
            const { data: res } = await this.$http.post('users', this.addFrom)
            if (res.meta.status !== 201) {
                return this.$message.error('添加用户失败')
            }
            this.$message.success('添加用户成功')
            // 隐藏添加的对话框
            this.addDialogVisible = false
            this.getUserList()
        })
    },

    // 修改用户信息
    async showEditDialog(id) {

        this.ediDialogVisible = true
        let { data: res } = await this.$http.get(`users/${id}`)
        if (res.meta.status !== 200) {
            return this.$message.error('获取用户信息失败')
        }
        this.editFrom = res.data
    },

    // 监听用户修改监听事件
    ediDialogclosed() {
        this.$refs.editFromRef.resetFields()
    },

    // 修改用户信息
    editUserInfo() {
        this.$refs.editFromRef.validate(async valid => {
            if (!valid) return
            const { data: res } = await this.$http.put(`users/${this.editFrom.id}`, {
                email: this.editFrom.email,
                mobile: this.editFrom.mobile
            })
            if (res.meta.status !== 200) {
                return this.$message.error('更新用户信息失败')
            }

            this.ediDialogVisible = false;

            this.getUserList();

            this.$message.success('更改用户信息成功')
        })
    }
}
