/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1414297509")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3101660191",
    "hidden": false,
    "id": "relation389373822",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "crap_report",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1414297509")

  // remove field
  collection.fields.removeById("relation389373822")

  return app.save(collection)
})
