/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3101660191")

  // add field
  collection.fields.addAt(6, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_887286546",
    "hidden": false,
    "id": "relation59357059",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "tag",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3101660191")

  // remove field
  collection.fields.removeById("relation59357059")

  return app.save(collection)
})
