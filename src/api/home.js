

export function getList(params) {
    let data = request({
        url: '/webAppSys/applyProduct',
        method: 'POST',
        data: params,
    })
    return data
}