// pb_hooks/main.pb.js

routerAdd("GET", "/hello/{name}", (e) => {
    let name = e.request.pathValue("name")

    return e.json(200, { "message": "Hello " + name })
})

//TODO: remove
routerAdd("POST", "/api/myapp/settings", (e) => {
    // do something ...
    return e.json(200, {"success": true})
}, $apis.requireAuth())

//TODO: remove
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
        return e.json(401, {"error": "Unauthorized"})
    }
    console.log("POST", "/api/myapp/initcrap")

    const data = new DynamicModel({
        "description": "test",
        "latitude": 123.1,
        "longitude": 123.1,
        "tags": [
            "RELATION_RECORD_ID"
        ],
    })

    e.bindBody(data)
    console.log("data", data)

    if (!data) {
        return e.json(400, {"error": "Invalid data"})
    }
    if (!data.description && !data.latitude && !data.longitude && !data.tags) {
        return e.json(400, {"error": "Missing required fields"})
    }
    if (data.description.length > 1000) {
        return e.json(400, {"error": "Description is too long"})
    }
    if (data.latitude < -90 || data.latitude > 90) {
        console.log("data.latitude", data.latitude)
        return e.json(400, {"error": "Invalid latitude"})
    }
    if (data.longitude < -180 || data.longitude > 180) {
        return e.json(400, {"error": "Invalid longitude"})
    }
    if (data.tags.length > 10) {
        return e.json(400, {"error": "Too many tags"})
    }

    // Create a new Crap Report record
    console.log("initcrap crap_report")
    let crap_report_collection = $app.findCollectionByNameOrId("crap_report")
    
    let cr_record = new Record(crap_report_collection)
    cr_record.set("user", authRecord.id)
    cr_record.set("status", "FIRST_SEEN")
    cr_record.set("description", data.description)
    cr_record.set("tags", data.tags)
    $app.save(cr_record)


    // Create a new Crap record
    console.log("initcrap crap")
    let crap_collection = $app.findCollectionByNameOrId("crap")

    let c_record = new Record(crap_collection)
    c_record.set("description", data.description)
    c_record.set("latitude", data.latitude)
    c_record.set("longitude", data.longitude)
    c_record.set("crap_report", [cr_record.id])

    /*console.log("check if image is uploaded")
    let uploadedFiles = e.findUploadedFiles("image")  // 'image' should match the form field name
    if (uploadedFiles && uploadedFiles.length > 0) {
        let file = uploadedFiles[0]

        // Optionally do a MIME type check:
        // if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
        //     return e.json(400, { "error": "Invalid file type" });
        // }

        // 7) Attach the file to the `image` field
        c_record.set("image", file)
    }*/

    $app.save(c_record)

    //let files = e.findUploadedFiles("document")
    // do something ...
    return e.json(200, {"success": true})
}/*,$apis.requireAuth()*/)