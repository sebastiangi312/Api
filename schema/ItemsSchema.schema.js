const itemSchema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://example.com/product.schema.json",
    "title": "Item",
    "description": "A Item from BackENd",
    "type": "object",
    "properties": {
      "id": {
        "description": "The unique identifier for an Item",
        "type": "integer"
      },
      "name": {
        "description": "Name of the Item",
        "type": "string"
      },
      "sellIn": {
        "description": "Time left to spoil",
        "type": "integer",
      },
      "quality": {
        "description": "Quality of The Item",
        "type": "integer",
      },
      "type": {
        "description": "Type of the Item",
        "type": "string"
      },
    },
    "required": [ "id","name", "sellIn", "quality", "type" ]
  };

exports.listPublicEventsSchema = itemSchema;