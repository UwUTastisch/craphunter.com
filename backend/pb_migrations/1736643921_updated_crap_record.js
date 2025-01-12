/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3101660191")

  // update collection data
  unmarshal({
    "name": "crap_report"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3101660191")

  // update collection data
  unmarshal({
    "name": "crap_record"
  }, collection)

  return app.save(collection)
})
