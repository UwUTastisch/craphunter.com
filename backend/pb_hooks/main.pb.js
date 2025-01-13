// pb_hooks/main.pb.js

routerAdd("GET", "/hello/{name}", (e) => {
    let name = e.request.pathValue("name")

    return e.json(200, { "message": "Hello " + name })
})

routerAdd("POST", "/api/myapp/settings", (e) => {
    // do something ...
    return e.json(200, {"success": true})
}, $apis.requireAuth())


routerAdd("POST", "/api/myapp/setting", (e) => {
    console.log("POST /api/myapp/settings")

    console.log("e.auth", e.auth)

    let body = e.requestInfo().body
    console.log("title",body.title)


    //let authRecord = e.auth
    //let data = e.request.json()
    //let files = e.findUploadedFiles("document")
    // do something ...
    console.log("returning success")
    return e.json(200, {"success": true})
},$apis.requireAuth())


routerAdd("POST", "/api/myapp/initcrap", (e) => {
    let authRecord = e.auth

    if (!authRecord) {
        return e.json(http.StatusUnauthorized, {"error": "Unauthorized"})
    }
    console.log("POST", "/api/myapp/initcrap")

    const data = new DynamicModel({
        "description": "test",
        "latitude": 123.1,
        "longitude": 123.1,
        "crap_record": {
            "user": "RELATION_RECORD_ID",
            //"status": "FIRST_SEEN",
            //"description": "test",
            "tags": [
                "RELATION_RECORD_ID"
            ]
        }
    })
    
    e.bindBody(data)
    console.log("data", data)

    let files = e.findUploadedFiles("document")
    // do something ...
    return e.json(200, {"success": true})
}/*,$apis.requireAuth()*/)