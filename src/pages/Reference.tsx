import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FooterSection from "@/components/FooterSection";

const fadeIn = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const stagger = (i: number) => ({
  ...fadeIn,
  transition: { ...fadeIn.transition, delay: i * 0.08 },
});

interface FieldDef {
  name: string;
  type: string;
  presence: "Required" | "Optional" | "Conditionally Required" | "Recommended";
  description: string;
}

interface FileDef {
  id: string;
  name: string;
  presence: string;
  description: string;
  primaryKey: string;
  fields: FieldDef[];
  hgtfsNote?: string;
}

const datasetFiles: { name: string; presence: string; description: string; id: string }[] = [
  { id: "agency", name: "agency.txt", presence: "Required", description: "Transit agencies or operators with service represented in this dataset." },
  { id: "stops", name: "stops.txt", presence: "Required", description: "Stops where vehicles pick up or drop off passengers. Also defines stations." },
  { id: "routes", name: "routes.txt", presence: "Required", description: "Transit routes. A route is a group of trips displayed as a single service." },
  { id: "trips", name: "trips.txt", presence: "Required", description: "Trips for each route. A trip is a sequence of two or more stops occurring during a specific time period." },
  { id: "stop_times", name: "stop_times.txt", presence: "Required", description: "Times that a vehicle arrives at and departs from stops for each trip." },
  { id: "calendar", name: "calendar.txt", presence: "Cond. Required", description: "Service dates specified using a weekly schedule with start and end dates." },
  { id: "calendar_dates", name: "calendar_dates.txt", presence: "Cond. Required", description: "Exceptions for the services defined in calendar.txt." },
  { id: "shapes", name: "shapes.txt", presence: "Optional", description: "Rules for mapping vehicle travel paths, sometimes referred to as route alignments." },
  { id: "frequencies", name: "frequencies.txt", presence: "Optional", description: "Headway (time between trips) for headway-based service." },
  { id: "transfers", name: "transfers.txt", presence: "Optional", description: "Rules for making connections at transfer points between routes." },
  { id: "feed_info", name: "feed_info.txt", presence: "Recommended", description: "Dataset metadata, including publisher, version, and temporal coverage." },
  { id: "historical_sources", name: "historical_sources.txt", presence: "Recommended", description: "HGTFS extension. Bibliographic references and archival sources used to compile the dataset." },
  { id: "network_edges", name: "network_edges.txt", presence: "Optional", description: "HGTFS extension. The network as a dated graph of edges between stops, for connectivity and accessibility analysis." },
  { id: "route_operators", name: "route_operators.txt", presence: "Optional", description: "HGTFS extension. The operator of each route over time (mergers, nationalisations)." },
  { id: "events", name: "events.txt", presence: "Optional", description: "HGTFS extension. Historical context that frames and annotates the timeline; may reference PeriodO." },
];

const fileDefinitions: FileDef[] = [
  {
    id: "agency",
    name: "agency.txt",
    presence: "Required",
    description: "Identifies the transit operator or historical authority responsible for the service.",
    primaryKey: "agency_id",
    hgtfsNote: "An agency may be a dissolved company, a government service, or a private firm. Use agency_name for the historical name, not a modern equivalent. Operators come and go: date_opened / date_closed model the operator's own lifespan, while route_operators.txt records which operator ran a given line over time.",
    fields: [
      { name: "agency_id", type: "Unique ID", presence: "Required", description: "Uniquely identifies a transit agency or operator." },
      { name: "agency_name", type: "Text", presence: "Required", description: "Full historical name of the transit operator." },
      { name: "agency_url", type: "URL", presence: "Optional", description: "URL of a reference page about this operator. May link to a Wikipedia article or archival record." },
      { name: "agency_timezone", type: "Timezone", presence: "Required", description: "Timezone of the agency. For pre-timezone-standardization periods, use the closest modern equivalent." },
      { name: "agency_lang", type: "Language code", presence: "Optional", description: "Primary language used by this agency (IETF BCP 47)." },
      { name: "date_opened", type: "Date", presence: "Recommended", description: "HGTFS extension. Date the operator began service (YYYYMMDD). Unifies temporal validity across all HGTFS files." },
      { name: "date_closed", type: "Date", presence: "Optional", description: "HGTFS extension. Date the operator ceased service, if applicable. Assert only with positive evidence." },
      { name: "agency_note", type: "Text", presence: "Optional", description: "HGTFS extension. Free-text note on the operator — era, lineage, or sourcing." },
    ],
  },
  {
    id: "stops",
    name: "stops.txt",
    presence: "Required",
    description: "Defines locations where vehicles pick up or drop off passengers — stations, coaching inns, post houses, or simple stops.",
    primaryKey: "stop_id",
    hgtfsNote: "Stops carry both spatial and temporal uncertainty. Use location_accuracy for position, and date_opened with its min/max bounds and date_precision for when the stop entered service. Names should reflect the period-appropriate toponym.",
    fields: [
      { name: "stop_id", type: "Unique ID", presence: "Required", description: "Uniquely identifies a stop or station." },
      { name: "stop_name", type: "Text", presence: "Required", description: "Period-appropriate name of the stop." },
      { name: "stop_lat", type: "Latitude", presence: "Required", description: "WGS84 latitude of the stop." },
      { name: "stop_lon", type: "Longitude", presence: "Required", description: "WGS84 longitude of the stop." },
      { name: "stop_desc", type: "Text", presence: "Optional", description: "Description of the stop (e.g. 'Coaching inn on the London–Bath road')." },
      { name: "location_type", type: "Enum", presence: "Optional", description: "0 = Stop/platform, 1 = Station. Same as GTFS." },
      { name: "parent_station", type: "Foreign ID", presence: "Optional", description: "References stop_id of the parent station." },
      { name: "location_accuracy", type: "Enum", presence: "Recommended", description: "HGTFS extension. 0 = Exact, 1 = Approximate (within 500m), 2 = Estimated (within 5km), 3 = Unknown." },
      { name: "date_opened", type: "Date", presence: "Recommended", description: "HGTFS extension. Best-estimate opening date (YYYYMMDD); a lower bound when uncertain ('open by this date')." },
      { name: "date_opened_min", type: "Date", presence: "Optional", description: "HGTFS extension. Earliest the stop could have opened (lower bracket)." },
      { name: "date_opened_max", type: "Date", presence: "Optional", description: "HGTFS extension. Latest it could have opened — typically the first date observed in service." },
      { name: "date_precision", type: "Text", presence: "Optional", description: "HGTFS extension. Resolution of the opening date (e.g. exact, open_by_1876, window_1886_1899)." },
      { name: "date_closed", type: "Date", presence: "Optional", description: "HGTFS extension. Closure date — only when positively evidenced; absence from a later source is not closure." },
    ],
  },
  {
    id: "routes",
    name: "routes.txt",
    presence: "Required",
    description: "Defines transit routes — a group of trips presented to passengers as a single service line.",
    primaryKey: "route_id",
    hgtfsNote: "HGTFS extends route_type to cover historical vehicle types. Use route_type values in the 1400–1499 range for HGTFS-specific modes.",
    fields: [
      { name: "route_id", type: "Unique ID", presence: "Required", description: "Uniquely identifies a route." },
      { name: "agency_id", type: "Foreign ID", presence: "Required", description: "References agency.agency_id." },
      { name: "route_short_name", type: "Text", presence: "Conditionally Required", description: "Short name of the route (e.g. 'London–Bath Mail')." },
      { name: "route_long_name", type: "Text", presence: "Conditionally Required", description: "Full descriptive name of the route." },
      { name: "route_desc", type: "Text", presence: "Optional", description: "Description of the route's purpose or history." },
      { name: "route_type", type: "Enum", presence: "Required", description: "Type of vehicle. Standard GTFS values plus HGTFS extensions: 1400 = Stagecoach, 1401 = Mail coach, 1402 = Horse-drawn omnibus, 1403 = Horse-drawn tram, 1404 = Canal packet boat, 1405 = Steam railway, 1406 = Early motorbus." },
      { name: "route_color", type: "Color", presence: "Optional", description: "Hex color for display." },
      { name: "date_opened", type: "Date", presence: "Recommended", description: "HGTFS extension. When the line entered service (YYYYMMDD); a lower bound when uncertain." },
      { name: "date_closed", type: "Date", presence: "Optional", description: "HGTFS extension. When the line closed, if known." },
    ],
  },
  {
    id: "trips",
    name: "trips.txt",
    presence: "Required",
    description: "Trips for each route. A trip is a sequence of two or more stops occurring during a specific time period.",
    primaryKey: "trip_id",
    fields: [
      { name: "route_id", type: "Foreign ID", presence: "Required", description: "References routes.route_id." },
      { name: "service_id", type: "Foreign ID", presence: "Required", description: "References calendar.service_id or calendar_dates.service_id." },
      { name: "trip_id", type: "Unique ID", presence: "Required", description: "Uniquely identifies a trip." },
      { name: "trip_headsign", type: "Text", presence: "Optional", description: "Destination signage (e.g. 'To Bath via Marlborough')." },
      { name: "shape_id", type: "Foreign ID", presence: "Optional", description: "References shapes.shape_id for the route geometry." },
      { name: "source_id", type: "Foreign ID", presence: "Recommended", description: "HGTFS extension. References historical_sources.source_id." },
    ],
  },
  {
    id: "stop_times",
    name: "stop_times.txt",
    presence: "Required",
    description: "Arrival and departure times for each stop along a trip.",
    primaryKey: "trip_id, stop_sequence",
    fields: [
      { name: "trip_id", type: "Foreign ID", presence: "Required", description: "References trips.trip_id." },
      { name: "arrival_time", type: "Time", presence: "Conditionally Required", description: "Arrival time at the stop (HH:MM:SS)." },
      { name: "departure_time", type: "Time", presence: "Conditionally Required", description: "Departure time from the stop (HH:MM:SS)." },
      { name: "stop_id", type: "Foreign ID", presence: "Required", description: "References stops.stop_id." },
      { name: "stop_sequence", type: "Non-negative Integer", presence: "Required", description: "Order of stops for a particular trip." },
      { name: "pickup_type", type: "Enum", presence: "Optional", description: "0 = Regular, 1 = None, 2 = Arrange with agency, 3 = Coordinate with driver." },
      { name: "drop_off_type", type: "Enum", presence: "Optional", description: "Same values as pickup_type." },
      { name: "time_accuracy", type: "Enum", presence: "Recommended", description: "HGTFS extension. 0 = Exact (from timetable), 1 = Estimated (calculated from distance/speed), 2 = Unknown." },
    ],
  },
  {
    id: "calendar",
    name: "calendar.txt",
    presence: "Conditionally Required",
    description: "Service dates specified using a weekly schedule. Required unless all dates are defined in calendar_dates.txt.",
    primaryKey: "service_id",
    hgtfsNote: "For historical services, exact days of operation may be uncertain. Use the best available evidence and document sources in historical_sources.txt.",
    fields: [
      { name: "service_id", type: "Unique ID", presence: "Required", description: "Uniquely identifies a set of dates when service is available." },
      { name: "monday", type: "Enum", presence: "Required", description: "1 = Service available, 0 = Not available." },
      { name: "tuesday", type: "Enum", presence: "Required", description: "Same as monday." },
      { name: "wednesday", type: "Enum", presence: "Required", description: "Same as monday." },
      { name: "thursday", type: "Enum", presence: "Required", description: "Same as monday." },
      { name: "friday", type: "Enum", presence: "Required", description: "Same as monday." },
      { name: "saturday", type: "Enum", presence: "Required", description: "Same as monday." },
      { name: "sunday", type: "Enum", presence: "Required", description: "Same as monday." },
      { name: "start_date", type: "Date", presence: "Required", description: "Start date for the service interval (YYYYMMDD)." },
      { name: "end_date", type: "Date", presence: "Required", description: "End date for the service interval (YYYYMMDD)." },
    ],
  },
  {
    id: "historical_sources",
    name: "historical_sources.txt",
    presence: "Recommended",
    description: "HGTFS extension. Bibliographic references and archival sources used to compile the transit data.",
    primaryKey: "source_id",
    hgtfsNote: "This file is unique to HGTFS and has no GTFS equivalent. It enables traceability and academic citation of the underlying historical evidence.",
    fields: [
      { name: "source_id", type: "Unique ID", presence: "Required", description: "Uniquely identifies a source." },
      { name: "source_name", type: "Text", presence: "Required", description: "Title of the source document or archive." },
      { name: "source_author", type: "Text", presence: "Optional", description: "Author or institutional creator." },
      { name: "source_year", type: "Integer", presence: "Recommended", description: "Year of publication or creation." },
      { name: "source_url", type: "URL", presence: "Optional", description: "URL of a digital copy or catalogue entry." },
      { name: "source_type", type: "Enum", presence: "Recommended", description: "0 = Published timetable, 1 = Government record, 2 = Map, 3 = Newspaper, 4 = Archival document, 5 = Secondary source, 6 = Other." },
      { name: "source_notes", type: "Text", presence: "Optional", description: "Free-text notes on reliability, coverage, or transcription method." },
    ],
  },
  {
    id: "network_edges",
    name: "network_edges.txt",
    presence: "Optional",
    description: "HGTFS extension. The transit network as a dated graph: edges between stops, for connectivity and accessibility analysis.",
    primaryKey: "from_stop_id, to_stop_id, route_id",
    hgtfsNote: "Models the network as an undirected graph of dated edges keyed on stop_id — the layer connectivity and market-access metrics need. Geometry may be schematic (straight stop-to-stop) where true alignments are unavailable; provide precise geometry via shapes.txt.",
    fields: [
      { name: "from_stop_id", type: "Foreign ID", presence: "Required", description: "References stops.stop_id — one endpoint of the segment." },
      { name: "to_stop_id", type: "Foreign ID", presence: "Required", description: "References stops.stop_id — the other endpoint." },
      { name: "route_id", type: "Foreign ID", presence: "Optional", description: "The line this segment belongs to. References routes.route_id." },
      { name: "date_opened", type: "Date", presence: "Recommended", description: "When the segment entered service (YYYYMMDD); a lower bound when uncertain." },
      { name: "date_closed", type: "Date", presence: "Optional", description: "When the segment closed, if known." },
      { name: "evidence", type: "Enum", presence: "Optional", description: "dated_line = opening derived from a dated source; current_only = topology known but undated." },
      { name: "line_name", type: "Text", presence: "Optional", description: "Human-readable name of the line." },
    ],
  },
  {
    id: "route_operators",
    name: "route_operators.txt",
    presence: "Optional",
    description: "HGTFS extension. The operator of each route over time — a route may pass between operators (mergers, nationalisations).",
    primaryKey: "route_id, agency_id, valid_from",
    hgtfsNote: "routes.agency_id holds a single canonical operator (e.g. the latest within the study window) for GTFS compatibility; this file records the full time-varying assignment. Where the operator is genuinely unresolved, use an explicit placeholder agency_id rather than guessing.",
    fields: [
      { name: "route_id", type: "Foreign ID", presence: "Required", description: "References routes.route_id." },
      { name: "agency_id", type: "Foreign ID", presence: "Required", description: "Operator during this interval. References agency.agency_id (or an explicit unresolved placeholder)." },
      { name: "valid_from", type: "Date", presence: "Required", description: "Start of this operator's tenure on the route (YYYYMMDD)." },
      { name: "valid_to", type: "Date", presence: "Optional", description: "End of tenure; empty if still current." },
      { name: "source", type: "Text", presence: "Optional", description: "Provenance of the assignment (e.g. rule, wikidata)." },
      { name: "confidence", type: "Enum", presence: "Optional", description: "high, medium, or low confidence in the assignment." },
    ],
  },
  {
    id: "events",
    name: "events.txt",
    presence: "Optional",
    description: "HGTFS extension. Significant historical moments that frame and annotate a feed's timeline.",
    primaryKey: "event_id",
    hgtfsNote: "A viewer can use the events' min/max date as its temporal window and surface each moment as the user scrubs. period_uri links a moment to a scholarly period definition (e.g. PeriodO) for linked-data interoperability. Curated and editable.",
    fields: [
      { name: "event_id", type: "Unique ID", presence: "Required", description: "Uniquely identifies an event." },
      { name: "date", type: "Date", presence: "Required", description: "Date of the moment, or the start of a period (YYYYMMDD)." },
      { name: "end_date", type: "Date", presence: "Optional", description: "End date, for events that span a period (e.g. a war)." },
      { name: "name", type: "Text", presence: "Required", description: "Short label for the moment." },
      { name: "description", type: "Text", presence: "Optional", description: "Free-text historical context." },
      { name: "period_uri", type: "URI", presence: "Optional", description: "A PeriodO (or other gazetteer) period-definition URI for this moment." },
    ],
  },
];

const fieldTypes = [
  { name: "Color", description: "Six-digit hexadecimal number (e.g. FFFFFF for white)." },
  { name: "Date", description: "Service day in YYYYMMDD format." },
  { name: "Date (YYYY)", description: "HGTFS extension. Year only, as a four-digit integer." },
  { name: "Enum", description: "An option from a set of predefined constants." },
  { name: "Foreign ID", description: "An ID referencing a unique ID in another file." },
  { name: "Latitude", description: "WGS84 latitude in decimal degrees (-90.0 to 90.0)." },
  { name: "Longitude", description: "WGS84 longitude in decimal degrees (-180.0 to 180.0)." },
  { name: "Language code", description: "IETF BCP 47 language code (e.g. en, de, it)." },
  { name: "Non-negative Integer", description: "An integer ≥ 0." },
  { name: "Text", description: "A UTF-8 string intended for human readers." },
  { name: "Time", description: "HH:MM:SS format. Times after midnight may exceed 24:00:00." },
  { name: "Timezone", description: "A TZ timezone identifier (e.g. Europe/Rome)." },
  { name: "Unique ID", description: "An internal ID, unique within its file. UTF-8, printable ASCII recommended." },
  { name: "URI", description: "A resolvable identifier URI — e.g. a PeriodO period definition (http://n2t.net/ark:/99152/...)." },
  { name: "URL", description: "A fully qualified URL including http:// or https://." },
];

const presenceBadge = (p: string) => {
  const base = "inline-block px-2 py-0.5 rounded-sm text-xs font-body font-medium";
  if (p.startsWith("Required") || p === "Required")
    return <span className={`${base} bg-primary/15 text-primary`}>{p}</span>;
  if (p.startsWith("Cond"))
    return <span className={`${base} bg-gold/20 text-foreground`}>{p}</span>;
  if (p === "Recommended")
    return <span className={`${base} bg-secondary/15 text-secondary`}>{p}</span>;
  return <span className={`${base} bg-muted text-muted-foreground`}>{p}</span>;
};

const Reference = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-14">
          <Link to="/" className="font-display font-bold text-foreground text-lg hover:text-primary transition-colors">
            HGTFS
          </Link>
          <div className="flex items-center gap-6 text-sm font-body">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <span className="text-foreground font-medium">Reference</span>
            <a href="/viewer/" className="text-muted-foreground hover:text-foreground transition-colors">Viewer</a>
            <a
              href="https://github.com/hgtfs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="py-20 border-b border-border">
        <div className="container max-w-4xl">
          <motion.div {...fadeIn}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-primary" />
              <span className="text-xs font-body tracking-widest uppercase text-muted-foreground">
                Specification
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground tracking-tight leading-[1.1] mb-4">
              HGTFS Reference
            </h1>
            <p className="text-lg font-body text-muted-foreground leading-relaxed max-w-2xl mb-6">
              The Historical General Transit Feed Specification adapts the{" "}
              <a
                href="https://gtfs.org/documentation/schedule/reference"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                GTFS Schedule Reference
              </a>{" "}
              for pre-20th-century transit systems. Fields marked as "HGTFS extension" are
              additions to the standard specification.
            </p>
            <p className="text-sm font-body text-muted-foreground">
              This document follows the conventions of{" "}
              <a href="https://tools.ietf.org/html/rfc2119" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                RFC 2119
              </a>{" "}
              for requirement levels.
            </p>
          </motion.div>
        </div>
      </header>

      <div className="container max-w-4xl py-16">
        {/* Table of Contents */}
        <motion.section {...fadeIn} className="mb-16">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-1.5 font-body text-sm text-muted-foreground">
            <li><a href="#temporal-model" className="text-primary hover:underline">The HGTFS Temporal Model</a></li>
            <li><a href="#dataset-files" className="text-primary hover:underline">Dataset Files</a></li>
            <li><a href="#field-types" className="text-primary hover:underline">Field Types</a></li>
            <li>
              <span>Field Definitions</span>
              <ul className="ml-6 mt-1.5 space-y-1 list-disc list-inside">
                {fileDefinitions.map((f) => (
                  <li key={f.id}>
                    <a href={`#${f.id}`} className="text-primary hover:underline font-mono text-xs">{f.name}</a>
                  </li>
                ))}
              </ul>
            </li>
          </ol>
        </motion.section>

        {/* Temporal Model */}
        <motion.section {...fadeIn} id="temporal-model" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">The HGTFS Temporal Model</h2>
          <div className="space-y-4 font-body text-sm text-muted-foreground leading-relaxed">
            <p>
              GTFS describes a network that exists <em>now</em>. HGTFS adds one idea on top: every entity is{" "}
              <span className="text-foreground font-medium">valid over a span of time</span>. Stops, routes,
              agencies and network edges all carry <code className="font-mono text-xs text-foreground">date_opened</code> and{" "}
              <code className="font-mono text-xs text-foreground">date_closed</code>, so a feed is no longer a
              snapshot but a history you can scrub through.
            </p>
            <p>
              <span className="text-foreground font-medium">Dates are usually uncertain.</span> Historical
              evidence rarely gives an exact day, and HGTFS represents this honestly:{" "}
              <code className="font-mono text-xs text-foreground">date_opened</code> is a GTFS-valid best
              estimate — a lower bound, "open by this date" — bracketed by{" "}
              <code className="font-mono text-xs text-foreground">date_opened_min</code> /{" "}
              <code className="font-mono text-xs text-foreground">date_opened_max</code> and a{" "}
              <code className="font-mono text-xs text-foreground">date_precision</code> label.{" "}
              <code className="font-mono text-xs text-foreground">date_closed</code> is asserted only with
              positive evidence — absence from a later source is not closure.
            </p>
            <p>
              <span className="text-foreground font-medium">The network is a graph.</span> Beyond stops and
              routes, <code className="font-mono text-xs text-foreground">network_edges.txt</code> records dated
              edges between stops — the layer connectivity and accessibility analysis needs. Because operators
              change over time, <code className="font-mono text-xs text-foreground">route_operators.txt</code>{" "}
              records who ran each line and when, while{" "}
              <code className="font-mono text-xs text-foreground">routes.agency_id</code> keeps a single
              canonical operator for GTFS compatibility.
            </p>
            <p>
              <span className="text-foreground font-medium">Context is data.</span> An optional{" "}
              <code className="font-mono text-xs text-foreground">events.txt</code> places significant moments on
              the timeline; a viewer can use their span as its temporal window and link each moment, via{" "}
              <code className="font-mono text-xs text-foreground">period_uri</code>, to a scholarly period
              definition such as{" "}
              <a href="https://perio.do" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">PeriodO</a>.
            </p>
          </div>
        </motion.section>

        {/* Dataset Files */}
        <motion.section {...fadeIn} id="dataset-files" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Dataset Files</h2>
          <p className="font-body text-muted-foreground text-sm mb-6">
            An HGTFS dataset is a ZIP archive containing the following comma-delimited text files.
            All files must be at the root level of the archive and encoded in UTF-8.
          </p>
          <div className="overflow-x-auto border border-border rounded-sm">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="px-4 py-3 text-left font-medium text-foreground">File Name</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Presence</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {datasetFiles.map((file, i) => (
                  <tr key={file.id} className="border-b border-border last:border-0 hover:bg-card/60 transition-colors">
                    <td className="px-4 py-3">
                      <a href={`#${file.id}`} className="font-mono text-xs text-primary hover:underline">{file.name}</a>
                    </td>
                    <td className="px-4 py-3">{presenceBadge(file.presence)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{file.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Field Types */}
        <motion.section {...fadeIn} id="field-types" className="mb-16 scroll-mt-20">
          <h2 className="text-2xl font-display font-bold text-foreground mb-6">Field Types</h2>
          <div className="overflow-x-auto border border-border rounded-sm">
            <table className="w-full text-sm font-body">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="px-4 py-3 text-left font-medium text-foreground">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-foreground">Description</th>
                </tr>
              </thead>
              <tbody>
                {fieldTypes.map((ft) => (
                  <tr key={ft.name} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-mono text-xs text-foreground whitespace-nowrap">{ft.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{ft.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Field Definitions */}
        <section className="space-y-16">
          <motion.h2 {...fadeIn} className="text-2xl font-display font-bold text-foreground">
            Field Definitions
          </motion.h2>

          {fileDefinitions.map((file, fi) => (
            <motion.div
              key={file.id}
              id={file.id}
              className="scroll-mt-20"
              {...stagger(fi)}
            >
              <div className="mb-4">
                <h3 className="text-xl font-display font-semibold text-foreground mb-1">
                  <span className="font-mono text-base">{file.name}</span>
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm font-body text-muted-foreground mb-3">
                  <span>File: {presenceBadge(file.presence)}</span>
                  <span className="text-border">·</span>
                  <span>Primary key: <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded-sm">{file.primaryKey}</code></span>
                </div>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{file.description}</p>
                {file.hgtfsNote && (
                  <div className="mt-3 p-3 border-l-2 border-primary bg-primary/5 rounded-r-sm">
                    <p className="font-body text-sm text-foreground leading-relaxed">
                      <span className="font-medium text-primary">HGTFS note:</span>{" "}
                      {file.hgtfsNote}
                    </p>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto border border-border rounded-sm">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-border bg-card">
                      <th className="px-4 py-3 text-left font-medium text-foreground">Field Name</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Type</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Presence</th>
                      <th className="px-4 py-3 text-left font-medium text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {file.fields.map((field) => (
                      <tr key={field.name} className="border-b border-border last:border-0 hover:bg-card/60 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-foreground whitespace-nowrap">{field.name}</td>
                        <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{field.type}</td>
                        <td className="px-4 py-3">{presenceBadge(field.presence)}</td>
                        <td className="px-4 py-3 text-muted-foreground">{field.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Back link */}
        <motion.div {...fadeIn} className="mt-20 pt-8 border-t border-border flex items-center justify-between">
          <Link to="/" className="text-sm font-body text-primary hover:underline">← Back to Home</Link>
          <a
            href="https://gtfs.org/documentation/schedule/reference"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            Original GTFS Reference →
          </a>
        </motion.div>
      </div>

      <FooterSection />
    </div>
  );
};

export default Reference;
