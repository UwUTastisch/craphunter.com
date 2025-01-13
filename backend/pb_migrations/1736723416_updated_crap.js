/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1414297509")

  // update collection data
  unmarshal({
    "createRule": null,
    "updateRule": null
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1414297509")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"\n",
    "updateRule": "@request.auth.id != \"\" &&\n@request.body.description:isset = false &&\n@request.body.latitude:isset = false &&\n@request.body.longitude:isset = false\n"
  }, collection)

  return app.save(collection)
})
