/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3101660191")

  // remove field
  collection.fields.removeById("relation1933643797")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3101660191")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1414297509",
    "hidden": false,
    "id": "relation1933643797",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "crap",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
})
