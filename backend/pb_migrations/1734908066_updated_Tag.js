/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_887286546")

  // update collection data
  unmarshal({
    "name": "tag"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_887286546")

  // update collection data
  unmarshal({
    "name": "Tag"
  }, collection)

  return app.save(collection)
})
