/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1414297509")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_3101660191",
    "hidden": false,
    "id": "relation3065288511",
    "maxSelect": 999,
    "minSelect": 1,
    "name": "craprecords",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1414297509")

  // remove field
  collection.fields.removeById("relation3065288511")

  return app.save(collection)
})
