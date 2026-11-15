const ORG = 'https://github.com/aromapacifico-devops';
const DOCS = `${ORG}/aromapacifico-devops-docs/blob/main/docs`;
const INFRA = `${ORG}/aromapacifico-devops-infra`;

export const links = {
  org: ORG,
  overview: `${DOCS}/architecture/overview.md`,
  overviewPdf: `${DOCS}/architecture/overview.pdf`,
  cost: `${DOCS}/governance/pilot-cost.md`,
  costPdf: `${DOCS}/governance/pilot-cost.pdf`,
  verification: `${INFRA}/blob/main/docs/verification.md`,
  infra: `${INFRA}#readme`,
  matrix: `${DOCS}/qa/validation-matrix.md`,
  decisions: `${DOCS}/adr/README.md`,
  assumptions: `${DOCS}/assumptions.md`,
  design: `${DOCS}/design/design-system.md`
};

export const metrics = [
  { n: 200, l: 'coffee farms', s: 'in Cauca, Huila and Tolima' },
  { n: 3, l: 'collection centers', s: 'up to 400 sacks a day each' },
  { n: 60, l: 'carriers on the road', s: 'one position every 5 minutes' },
  { n: 5, pre: '< ', u: ' min', l: 'to alert a farmer', s: 'within 24 hours with no signal' },
  { n: 5, u: ' years', l: 'of history kept', s: 'readings, photos, flights and sacks' }
];

export const compare = [
  ['Data coverage is assumed on most farms', 'Every device keeps up to 24 hours of data and sends it when a path returns'],
  ['A device publishes straight to the cloud', 'The node writes each reading to encrypted flash before its modem powers on'],
  ['Weekly visits to the farms carry the data', 'A LoRaWAN gateway shared by the vereda, and drones that fly where a sensor points'],
  ['Collection centers have no network', 'One segmented network pattern repeated three times, with a private link to the cloud'],
  ['The port needs its own network', 'The platform records only the delivery of the sack, from the phone of the carrier'],
  ['Prices, devices and services of 2020', 'Every cost calculated again from current price lists and quotations']
];

export const journey = [
  {
    place: 'Farm', state: 'prep', badge: 'In preparation', code: 'in_preparation',
    title: 'The sack is born with a random code',
    text: 'A solar node reads soil and air every 4 hours and the grain every hour while a lot dries. The farmer registers each 60 kg sack, and its code reveals nothing about the farm.',
    off: 'The node stores up to 24 hours of readings and retries each hour.'
  },
  {
    place: 'Road', state: 'transit', badge: 'In transit', code: 'in_transit_to_center',
    title: 'The carrier takes custody',
    text: 'The carrier scans every sack of the load, and the phone reports one position every 5 minutes on the way to the collection center.',
    off: 'Positions queue for 24 hours at most, and custody events stay on the phone until the platform confirms them.'
  },
  {
    place: 'Collection center', state: 'ok', badge: 'Accepted', code: 'at_center_accepted',
    title: 'Reception, inspection and dispatch',
    text: 'Logistics stations record reception, inspection, acceptance or rejection and dispatch, up to 400 sacks a day in harvest. A sack that arrives with no code gets a printed label.',
    off: 'Reception continues on the local network and synchronizes when the link returns.'
  },
  {
    place: 'Port', state: 'transit', badge: 'In transit', code: 'in_transit_to_port',
    title: 'Delivery in Buenaventura',
    text: 'The carrier records the delivery in three steps, with the receiver and the receipt. The Federation deploys no equipment at the port.',
    off: 'The delivery event waits in the queue of the phone with no time limit.'
  },
  {
    place: 'Buyer', state: 'ok', badge: 'Accepted', code: 'delivered_accepted',
    title: 'One scan opens the history',
    text: 'The code on the sack opens a public page with no account. It shows origin, process dates, state and drying, and nothing that names a farm, a trip or a person.',
    off: 'The lookup holds peaks of 30 reads a minute behind a web firewall, and every read is audited.'
  }
];

export const layers = [
  {
    name: 'Governance',
    title: 'Every account is born with its rules',
    text: 'Seven accounts under one AWS Organization. Region limits, audit protection, default encryption, mandatory tags and budgets apply from the root, so no team has to remember them. Azure East US stays prepared with contracts and nothing running.',
    facts: [['7', 'accounts'], ['6', 'mandatory tags'], ['USD 230', 'production budget a month']],
    img: '05-landing-zone', cap: 'Accounts of the organization and the controls that apply from the root'
  },
  {
    name: 'Security',
    title: 'One identity for each actor',
    text: 'People, services and devices never share credentials. Farmers and carriers sign in with their phone, centers and drone crews with MFA, each function has its own role and each node and drone its own certificate. Evidence of sensitive events rests five years where no workload account can alter it.',
    facts: [['6', 'human roles'], ['X.509', 'per node and drone'], ['38', 'firewall rules in one matrix']],
    img: '11-audit-evidence-path', cap: 'How evidence of a sensitive event reaches a store that no account can alter'
  },
  {
    name: 'Connectivity',
    title: 'Designed for places with no signal',
    text: 'Farms have no cable, some have no coverage, drones fly far from any phone and each center starts with no network. Every kind of site has its protocol, its local buffer and a defined behavior while the link is down.',
    facts: [['24 h', 'local buffer'], ['100 Mbps', 'dedicated link per center'], ['2', 'VPN tunnels per center']],
    img: '03-connectivity-and-centers', cap: 'How each site connects and what happens with no signal'
  },
  {
    name: 'Farm monitoring',
    title: 'A node that sleeps and a farmer who knows',
    text: 'The node wakes once an hour on solar power and receives its configuration while it sleeps. The Federation changes the alert ranges as versions in the platform, with no firmware update, and the alert reaches the farmer by push, with SMS only for an urgent drying alert.',
    facts: [['4 h', 'between crop readings'], ['1 h', 'between drying readings'], ['99%', 'of alerts within 5 minutes']],
    img: '15-alert-delivery-sequence', cap: 'How an alert reaches the farmer and how each step is recorded'
  },
  {
    name: 'Drones',
    title: 'A drone flies where a sensor points',
    text: 'Five services that do not replace one another. Drones delimit the lot, confirm a pest focus, fumigate, verify and estimate the harvest. Functions confirm, classify and estimate, and only a named person authorizes a fumigation, because a wrong one cannot be undone.',
    facts: [['5', 'drone services'], ['3', 'brigades, one per department'], ['17', 'states of a fumigation order']],
    img: '04-pest-to-fumigation', cap: 'From a crop alert to a confirmed focus, an authorized fumigation and a closed case'
  },
  {
    name: 'Traceability',
    title: 'A history that cannot be rewritten',
    text: 'Every event of a sack keeps its date, time and responsible person in an insert-only custody chain. The state of the sack is derived from that history, so an event that arrives late or twice does no harm.',
    facts: [['7', 'sack states'], ['15 min', 'of events lost at most'], ['4 h', 'to restore the public query']],
    img: '08-sack-state-model', cap: 'The states a sack can pass through and what a rejection does'
  },
  {
    name: 'Inference',
    title: 'Nothing runs between events',
    text: 'A function starts when a complete input is stored, reads that exact version, calls a managed service and writes one result. Rekognition keeps photos with people away from the model and Bedrock analyzes the crop. No model is trained and no server waits.',
    facts: [['4', 'inference functions'], ['3', 'retries, then a dead letter queue'], ['USD 2.76', 'per 1,000 invocations']],
    img: '19-inference-functions', cap: 'How a stored flight record or archive object reaches one of four results'
  },
  {
    name: 'Observability',
    title: 'Two objectives and alarms with an owner',
    text: 'Shared identifiers tie a sack, a lot and a flight to their records. Alarms report silent nodes, undelivered alerts, flights with no stored record and fumigations that cannot close, and each one names who answers and the first action.',
    facts: [['99%', 'alerts handed off in 5 minutes'], ['99.5%', 'sack lookups answered'], ['6', 'custom metrics']],
    img: '20-signals-and-correlation', cap: 'The identifiers that travel with a sack, a lot and a flight'
  }
];

export const boxes = [
  ['C01', 'Repository, roots and environments', 12],
  ['C02', 'Remote state with locking', 8],
  ['C03', 'VPC, subnets and routes', 12],
  ['C04', 'Link to one collection center', 8],
  ['C05', 'Platform identities and encryption', 12],
  ['C06', 'Permanent cloud firewall rules', 8],
  ['C07', 'Telemetry ingestion pattern', 11],
  ['C08', 'Inference function pattern', 12],
  ['C09', 'Pipeline, approval and evidence', 14],
  ['C10', 'Reusable module of one farm', 3]
];

export const modules = [
  ['terraform-aws-telemetry-ingestion', 'v1.0.1', 46, 'From IoT Core to the readings table, the archive and the alerts'],
  ['terraform-aws-security', 'v0.6.0', 37, 'Identities, encryption keys and cloud firewall rules'],
  ['terraform-aws-network', 'v1.1.0', 20, 'VPC, seven subnets, endpoints and the link to a center'],
  ['terraform-aws-inference-function', 'v1.0.0', 19, 'Event bus, work queue, dead letter queue and function'],
  ['terraform-aws-farm', 'v1.0.0', 5, 'Identity of one farm node, repeated for each farm']
];

export const pipeline = [
  { t: 'Pull request', p: 'Format, validation, module tests, TFLint, Checkov, secret scan and cost' },
  { t: 'Plan', p: 'One plan per environment, kept in its private state bucket' },
  { t: 'Approval', p: 'A named person reads the production plan and approves it' },
  { t: 'Apply', p: 'Exactly that plan, with a short-lived role and no stored keys' },
  { t: 'Smoke test', p: 'One reading travels from IoT Core to the readings table' },
  { t: 'Destroy', p: 'Environments come down when the work session ends' }
];

export const proof = [
  { n: 127, l: 'resources applied in the test environment', s: 'from the main branch, through the pipeline' },
  { n: 10, pre: '~', u: ' s', l: 'for a reading to reach its table', s: 'through the rule, the queue and the function' },
  { n: 0, l: 'changes in a second plan', s: 'and the drift check passed in every environment' },
  { n: 127, l: 'resources removed at teardown', s: 'the test state ended empty' }
];

export const unproven = [
  ['Production apply', 'It waits for the static addresses of the three center links, and no address is invented in the code'],
  ['The center link applied', 'It bills by the hour and needs a real address at a center'],
  ['A device publishing with its certificate', 'The sample node was tested with the pipeline role, from the broker onward'],
  ['Application functions', 'Range evaluation, alert delivery and focus confirmation run placeholder code']
];

export const failures = [
  ['A node loses signal', 'It stores readings and retries each hour', 'Nothing in an outage of up to 23 hours'],
  ['A shared gateway fails', 'Nodes keep buffering and an alarm reports the silent vereda', 'Nothing in an outage of up to 23 hours'],
  ['A carrier loses data', 'The application queues positions and custody events, and sends custody first', 'No custody event'],
  ['A center loses its link', 'Staff keep receiving sacks and the label printer works on the local network', 'Nothing'],
  ['A VPN tunnel fails', 'The second tunnel of the same connection takes over', 'Nothing'],
  ['A function fails', 'Three retries, then the dead letter queue and an alarm', 'Nothing, the case does not change'],
  ['A person appears in a photo', 'The object moves to a restricted prefix and skips inference', 'The capture is repeated'],
  ['A verification never arrives', 'The fumigation stays open and appears on the dashboard', 'Nothing'],
  ['A deployment goes wrong', 'The pipeline returns to the previous version', 'Nothing, events wait in queues'],
  ['A table is corrupted', 'Point-in-time restore to a new table', 'About 5 minutes at most'],
  ['The Region is lost', 'Rebuild from code and the archive, in a planned effort', 'Outside the objectives of the pilot']
];

export const yearShare = [
  ['Drone service', 111864.52],
  ['Field operation of 200 farms', 26122.56],
  ['Links of the three centers', 3852],
  ['Cloud platform, production', 2282.52],
  ['Development and test', 146.88]
];

export const costs = [
  { l: 'A normal month', v: '6,377 to 6,469', note: 'Cloud, links, field operation and drones together.' },
  { l: 'A harvest month', v: '23,036 to 23,128', note: 'The brigades fly a campaign a month in harvest.' },
  { l: 'Cloud platform a month', v: '181.78', note: 'About 84 percent is the private network of the centers. A harvest month costs 207.07.' },
  { l: 'Investment of one farm', v: '467.48', note: 'Known hardware of a farm, with a proposed monthly amount of 11.77.' },
  { l: 'Avoided each year', v: '~2.04 million', note: 'Drones fly on a sensor alert or a scheduled service, with no weekly sweep of every farm.' }
];

export const views = [
  {
    k: 'farmer', name: 'Farmer', n: 8,
    text: 'Used on the farm in full daylight. High contrast, short sentences and few figures, for a farmer who trusts the notebook more than an application.',
    shots: [[1, 'Farm within range'], [3, 'Drying with an urgent alert'], [4, 'Alerts'], [8, 'The numbers']]
  },
  {
    k: 'carrier', name: 'Carrier', n: 9,
    text: 'Used on the road and next to the truck, with one hand. Large buttons within reach of the thumb, and every screen works with no data.',
    shots: [[1, 'Open trip'], [2, 'Scanner'], [4, 'Delivery at the port'], [8, 'Tasks with no data']]
  },
  {
    k: 'buyer', name: 'Buyer', n: 5,
    text: 'Opens when the code of a sack is scanned, with no account. Origin, the dates of the journey and the drying, and nothing more.',
    shots: [[1, 'Result on a phone'], [2, 'Rejected sack'], [3, 'Code not registered'], [4, 'Write the code']],
    wide: [5, 'Result on a desktop']
  }
];

export const palette = [
  ['Roast red', '#8C0303', '#fff', 'Roast and land of origin'],
  ['Pacific blue', '#0378A6', '#fff', 'Sea of Buenaventura and telemetry'],
  ['Andean sun', '#F29F05', '#161412', 'Sun and the quality seal'],
  ['Ink', '#161412', '#fff', 'Main text, 17.5 to 1'],
  ['Canvas', '#FBF9F5', '#161412', 'Warm background against glare'],
  ['Muted', '#F5F2EB', '#161412', 'Secondary surfaces']
];

export const badges = [
  ['prep', 'In preparation', 'Registered at the farm'],
  ['transit', 'In transit', 'In custody of the carrier'],
  ['ok', 'Accepted', 'Inspected or delivered'],
  ['bad', 'Rejected', 'Humidity or quality out of range']
];

export const alerts = [
  ['normal', 'Tu cultivo está dentro del rango', 'Normal. Nobody needs to act.'],
  ['warn', 'La humedad del suelo está por debajo del rango', 'Preventive. A reading outside the agronomic range.'],
  ['urgent', 'La temperatura del grano pasó de 40 °C. Actúa ahora.', 'Urgent. It stays visible in full sun.']
];

export const diagrams = [
  ['00-platform-overview', 'Platform overview', 'What is the whole platform'],
  ['01-end-to-end', 'End to end', 'Which path, boundary and identity each flow has'],
  ['02-implementation-scope', 'Implementation scope', 'What the infrastructure code builds, box by box'],
  ['03-connectivity-and-centers', 'Connectivity and centers', 'How each site connects with and without signal'],
  ['04-pest-to-fumigation', 'Pest to fumigation', 'How an alert becomes a closed case'],
  ['05-landing-zone', 'Landing zone', 'Which accounts exist and what applies from the root'],
  ['06-environments', 'Environments', 'How a change reaches production'],
  ['07-farm-connection-sequence', 'Farm connection', 'How a node connects, loses its link and recovers'],
  ['08-sack-state-model', 'Sack states', 'Which states a sack can pass through'],
  ['09-center-wlan', 'Center WLAN', 'Which network each zone uses and what it reaches'],
  ['10-drone-mission-link', 'Drone mission link', 'How a mission is loaded, flown with no signal and published'],
  ['11-audit-evidence-path', 'Audit evidence', 'How evidence reaches a store that no account can alter'],
  ['12-lot-geometry-lifecycle', 'Lot geometry', 'Which strips keep spraying away from houses and water'],
  ['13-center-operation', 'Center operation', 'How a center receives, labels and dispatches sacks'],
  ['14-crop-case-states', 'Crop case', 'How an alert becomes a focus confirmed by a person'],
  ['15-alert-delivery-sequence', 'Alert delivery', 'How an alert reaches the farmer'],
  ['16-fumigation-order-states', 'Fumigation order', 'Which moves only a person can make'],
  ['17-public-query', 'Public query', 'How a buyer reads one sack and what limits bulk reads'],
  ['18-center-cloud-link', 'Center cloud link', 'How a center reaches the cloud and what happens on failure'],
  ['19-inference-functions', 'Inference functions', 'How a stored record reaches one of four results'],
  ['20-signals-and-correlation', 'Signals', 'Which identifiers travel with a sack, a lot and a flight'],
  ['21-flight-object-transport', 'Flight objects', 'Where each flight object lives until it is published'],
  ['22-delivery-pipelines', 'Delivery pipelines', 'How one version moves to production and how it goes back']
];

export const evidence = [
  { n: 66, l: 'subject documents', s: 'each with its decisions, failures, cost and sources', href: `${ORG}/aromapacifico-devops-docs/tree/main/docs` },
  { n: 37, l: 'decision records', s: 'with the alternatives that were discarded and why', href: links.decisions },
  { n: 129, l: 'assumptions', s: 'each with what changes if it fails', href: links.assumptions },
  { n: 80, l: 'requirements mapped', s: 'to the document or the code that answers them', href: links.matrix },
  { n: 18, l: 'failure scenarios', s: 'followed to the safe state the platform keeps', href: links.matrix },
  { n: 28, l: 'check scripts', s: 'that recompute the figures and validate the contracts', href: `${ORG}/aromapacifico-devops-docs` }
];

export const repos = [
  ['aromapacifico-devops-docs', 'Architecture, decisions, diagrams, cost and design documents'],
  ['aromapacifico-devops-infra', 'Terraform roots of each environment, bootstrap and pipelines'],
  ['terraform-aws-network', 'VPC, subnets, routes, endpoints and the link to one center'],
  ['terraform-aws-security', 'Platform identities, encryption keys and firewall rules'],
  ['terraform-aws-telemetry-ingestion', 'Ingestion path from IoT Core to storage and alerts'],
  ['terraform-aws-farm', 'Reusable identity of one farm'],
  ['terraform-aws-inference-function', 'Event-driven inference function pattern'],
  ['terraform-aws-module-template', 'Skeleton that starts a new module'],
  ['.github', 'Organization profile and shared workflows']
].map(([n, d]) => [n, d, `${ORG}/${n}`]);
