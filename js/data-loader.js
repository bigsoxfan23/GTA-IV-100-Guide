function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function buildSections(records) {
  const sections = new Map();

  const sortedRecords = [...records].sort(
    (a, b) => a['Timeline Order'] - b['Timeline Order']
  );

  for (const record of sortedRecords) {
    const sectionName = record.Section || 'Other';

    const groupName =
      record.Name === 'Choose Deal or Revenge'
        ? 'Mission'
        : record.Type || 'Other';

    if (!sections.has(sectionName)) {
      sections.set(sectionName, {
        id: slugify(sectionName),
        tab: sectionName,
        title: sectionName,
        desc: `${sectionName} tasks in recommended timeline order.`,
        note: '',
        groups: []
      });
    }

    const section = sections.get(sectionName);

    let group = section.groups.find(
      candidate => candidate.name === groupName
    );

    if (!group) {
      group = {
        name: groupName,
        items: []
      };

      section.groups.push(group);
    }

    const timelineItem = {
      timelineId: record['Timeline ID'],
      type: record.Type || 'Other',
      name: record.Name,
      requirement: record.Requirement || '',
      tag: record.Requirement,
      tone: record.Requirement === '100%' ? 'warn' : '',
      instructions: record.Instructions,
      availableAfter: record['Available After'],
      travelZone: record['Travel Zone'],
      whyNow: record['Why Now?']
    };

    group.items.push(timelineItem);
  }

  return [...sections.values()];
}

export async function loadTimelineData(
  url = './data/timeline.json'
) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Could not load timeline data: HTTP ${response.status}`
    );
  }

  const records = await response.json();

  if (!Array.isArray(records)) {
    throw new Error('Timeline data must contain an array.');
  }

  return buildSections(records);
}