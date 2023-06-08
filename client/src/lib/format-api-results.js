export default function formatApiResults(apiResults) {
  const formattedResults = apiResults.map((card) => {
    return {
      name: card.name,
      collectorNumber: card.collector_number,
      setName: card.set_name,
      setCode: card.set,
      rarity: card.rarity,
      finishes: card.finishes.join(', '),
      finish: card.finishes[0],
      cardId: card.id,
      image: card.card_faces && card.card_faces[0].image_uris ? card.card_faces[0].image_uris.normal.substring(32) : card.image_uris?.normal.substring(32),
      manaCost: card.card_faces ? card.card_faces[0].mana_cost : card.mana_cost,
      typeLine: card.card_faces ? card.card_faces[0].type_line : card.type_line,
      oracleText: card.card_faces ? (card.card_faces[0].oracle_text ? card.card_faces[0].oracle_text : '') : (card.oracle_text ? card.oracle_text : ''),
      power: card.card_faces ? (card.card_faces[0].power ? card.card_faces[0].power : '') : (card.power ? card.power : ''),
      toughness: card.card_faces ? (card.card_faces[0].toughness ? card.card_faces[0].toughness : '') : (card.toughness ? card.toughness : ''),
      flavorText: card.card_faces ? (card.card_faces[0].flavor_text ? card.card_faces[0].flavor_text : '') : (card.flavor_text ? card.flavor_text : ''),
      artist: card.artist
    }
  })
  return formattedResults;
}
