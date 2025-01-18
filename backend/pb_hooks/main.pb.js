// pb_hooks/main.pb.js
/*
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
*/

//check if register_token is valid
onRecordCreateExecute((e) => {
  const user = e.record;

  // Log the event object to the console
  //console.log("test");

  //console.log("Event Object:" , JSON.stringify(user, null, 2));
  //console.log("Event Object:" , JSON.stringify(user.fieldsData(), null, 2));

  const token = user.get("registerToken");

  if (!token) {
    //console.log("registerToken", token);
    //throw new Error('A valid registerToken is required to register.');
    throw new BadRequestError(
      "A valid registerToken is required to register.",
      { registerToken: "A valid registerToken is required to register." }
    );
  }

  //console.log("check if token is valid")
  // Fetch the token record from the "register_token" collection
  try {
    let tokenRecord = $app.findFirstRecordByData("register_token", "token", token);
    if (!tokenRecord) {
      //throw new Error("token not find")
      throw new BadRequestError("Invalid registerToken.", {
        registerToken: "Invalid registerToken.",
      });
    }
    //console.log("tokenRecord", tokenRecord);
    // Check if the token has uses left
    if (tokenRecord.uses_left <= 0) {
      console.log("tokenRecord.uses_left", tokenRecord.uses_left);
      //throw new Error('This token has no uses left.');
      throw new BadRequestError("This token has no uses left.", {
        registerToken: "This token has no uses left.",
      });
    }
  } catch (err) {
    //throw new Error("token not find")
    //console.log("tokenRecord not found", err);
    throw new BadRequestError("Invalid registerToken.", {
      registerToken: "Invalid registerToken.",
    });
  }

  e.next();
}, "users");

onRecordAfterCreateSuccess((e) => {
  const user = e.record;

  const token = user.get("registerToken");

  //console.log("check if token is valid")
  // Fetch the token record from the "register_token" collection
  try {
    let tokenRecord = $app.findFirstRecordByData("register_token", "token", token);
    if (!tokenRecord) {
      //throw new Error("token not find")
      throw new BadRequestError("Invalid registerToken.", {
        registerToken: "Invalid registerToken.",
      });
    }

    // Update the token to decrement uses_left and track the user
    tokenRecord.set("usesLeft", tokenRecord.get("usesLeft") - 1);
    tokenRecord.set("usedBy", [...(tokenRecord.get("usedBy") || []), user.id]);

    $app.save(tokenRecord);
  } catch (err) {
    //throw new Error("token not find")
    throw new BadRequestError("Invalid registerToken.", {
      registerToken: "Invalid registerToken.",
    });
  }

  e.next();
}, "users");

/*
registerHooks(app) {
    app.on('users.beforeCreate', async (req, context) => {
        const { registerToken } = req.data;

        // Ensure the token is provided
        if (!registerToken) {
            throw new Error('A valid registerToken is required to register.');
        }

        // Fetch the token record from the "register_token" collection
        const tokenRecord = await app.collection('register_token').getFirstListItem(`token = "${registerToken}"`);

        if (!tokenRecord) {
            throw new Error('Invalid registerToken.');
        }

        // Check if the token has uses left
        if (tokenRecord.uses_left <= 0) {
            throw new Error('This token has no uses left.');
        }

        // Update the token to decrement uses_left and track the user
        await app.collection('register_token').update(tokenRecord.id, {
            uses_left: tokenRecord.uses_left - 1,
            used_by: [...(tokenRecord.used_by || []), req.record.id],
        });

        // Remove registerToken from user data to avoid storing it
        delete req.data.registerToken;
    });
}*/

routerAdd(
  "POST",
  "/api/myapp/initcrap",
  (e) => {
    let authRecord = e.auth;

    if (!authRecord) {
      return e.json(401, { error: "Unauthorized" });
    }
    console.log("POST", "/api/myapp/initcrap");

    const data = new DynamicModel({
      description: "test",
      latitude: 123.1,
      longitude: 123.1,
      tags: ["RELATION_RECORD_ID"],
      image: "",
    });

    e.bindBody(data);
    console.log("data", data);

    if (!data) {
      return e.json(400, { error: "Invalid data" });
    }
    if (!data.description && !data.latitude && !data.longitude && !data.tags) {
      return e.json(400, { error: "Missing required fields" });
    }
    if (data.description.length > 1000) {
      return e.json(400, { error: "Description is too long" });
    }
    if (data.latitude < -90 || data.latitude > 90) {
      console.log("data.latitude", data.latitude);
      return e.json(400, { error: "Invalid latitude" });
    }
    if (data.longitude < -180 || data.longitude > 180) {
      return e.json(400, { error: "Invalid longitude" });
    }
    if (data.tags.length > 10) {
      return e.json(400, { error: "Too many tags" });
    }
    if (!data.image) {
      return e.json(400, { error: "Image not supported", image: data.image });
    }
    // Decode base64 image and check if it's a valid JPEG
    let base64Image = data.image;
    let buffer = Buffer.from(base64Image, "base64");

    // Check if the buffer is a valid JPEG
    if (
      buffer[0] !== 0xff ||
      buffer[1] !== 0xd8 ||
      buffer[buffer.length - 2] !== 0xff ||
      buffer[buffer.length - 1] !== 0xd9
    ) {
      return e.json(400, { error: "Invalid JPEG image" });
    }

    let jpegfile = $filesystem.fileFromBytes(
      buffer,
      /*"image/jpeg",*/ "crap.jpg"
    );

    // Create a new Crap Report record
    console.log("initcrap crap_report");
    let crap_report_collection = $app.findCollectionByNameOrId("crap_report");

    let cr_record = new Record(crap_report_collection);
    cr_record.set("user", authRecord.id);
    cr_record.set("status", "FIRST_SEEN");
    cr_record.set("description", data.description);
    cr_record.set("tags", data.tags);
    cr_record.set("image", jpegfile);
    $app.save(cr_record);

    // Create a new Crap record
    console.log("initcrap crap");
    let crap_collection = $app.findCollectionByNameOrId("crap");

    let c_record = new Record(crap_collection);
    c_record.set("description", data.description);
    c_record.set("latitude", data.latitude);
    c_record.set("longitude", data.longitude);
    c_record.set("crap_report", [cr_record.id]);

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

    $app.save(c_record);

    //let files = e.findUploadedFiles("document")
    // do something ...
    return e.json(200, { success: true });
  } /*,$apis.requireAuth()*/
);
