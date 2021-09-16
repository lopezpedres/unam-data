-- Select total record count - How many records are in the table: 677527
SELECT COUNT(folio_id) FROM scraped_data

-- Select unique folio_id count - How many students: 299124
SELECT COUNT(DISTINCT folio_id) FROM scraped_data