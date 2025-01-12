/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1414297509")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"\n"
  }, collection)

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1414297509",
    "hidden": false,
    "id": "relation1933643797",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "crap",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1414297509")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\""
  }, collection)

  // remove field
  collection.fields.removeById("relation1933643797")

  return app.save(collection)
})
