export function convertRecord(record) {
  return {
    "Timeline ID": record["Timeline ID"],
    "Game ID": record["Game ID"],
    "Timeline Order": Number(record["Timeline Order"]),
    "Section": record["Section"],
    "Type": record["Type"],
    "Name": record["Name"],
    "Requirement": record["Requirement"],
    "Available After": record["Available After"],
    "Travel Zone": record["Travel Zone"],
    "Instructions": record["Instructions"],
    "Why Now?": record["Why Now?"],
    "Status": record["Status"],
    "Verified": record["Verified"],
    "Source 1": record["Source 1"],
    "Source 2": record["Source 2"],
    "Research Notes": record["Research Notes"],
    "App Notes": record["App Notes"],
  };
}

export function convertRecords(records) {
  return records.map(convertRecord);
}