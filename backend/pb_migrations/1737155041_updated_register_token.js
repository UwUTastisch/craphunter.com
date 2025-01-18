/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2933788756")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number3417995268",
    "max": null,
    "min": null,
    "name": "usesLeft",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation1391357636",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "usedBy",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2933788756")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number3417995268",
    "max": null,
    "min": null,
    "name": "uses_left",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // update field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation1391357636",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "used_by",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
