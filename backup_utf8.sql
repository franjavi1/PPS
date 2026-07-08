--
-- PostgreSQL database dump
--

\restrict J7Z4oQ3Gslop9zfwdcfHBTqDgJdKUfyWIwUdGXaV83nSftitsB2sxWYh2oWfuiF

-- Dumped from database version 16.14 (Debian 16.14-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Debian 16.14-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Aulas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Aulas" (
    id_aula integer NOT NULL,
    "sedesId" integer NOT NULL,
    aula character varying(45) NOT NULL,
    "esVirtual" integer NOT NULL,
    "usuarioAccion" integer NOT NULL,
    estado integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: Aulas_id_aula_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Aulas_id_aula_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Aulas_id_aula_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Aulas_id_aula_seq" OWNED BY public."Aulas".id_aula;


--
-- Name: AutoridadComision; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."AutoridadComision" (
    id integer NOT NULL,
    "tipoAutoridadId" integer NOT NULL,
    "legajoId" integer NOT NULL,
    "comisionId" integer NOT NULL,
    "usuarioAccion" integer,
    "tsCreacion" timestamp without time zone DEFAULT now(),
    "tsModificacion" timestamp without time zone DEFAULT now()
);


--
-- Name: AutoridadComision_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."AutoridadComision_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: AutoridadComision_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."AutoridadComision_id_seq" OWNED BY public."AutoridadComision".id;


--
-- Name: Comision; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Comision" (
    "idComision" integer NOT NULL,
    "Descripcion" character varying(45) NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone NOT NULL,
    "tsModificacion" timestamp without time zone NOT NULL
);


--
-- Name: ComisionAsignatura; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ComisionAsignatura" (
    "idComisionAsignatura" integer NOT NULL,
    "planAsignaturasId" integer NOT NULL,
    "aulaId" integer NOT NULL,
    nombre character varying(45) NOT NULL,
    modalidad character varying(45) NOT NULL,
    "cupoMaximo" integer NOT NULL,
    estado character varying(45) NOT NULL,
    "usuarioAccion" integer,
    "tsCreacion" timestamp without time zone DEFAULT now(),
    "tsModificacion" timestamp without time zone DEFAULT now(),
    "idComision" integer NOT NULL
);


--
-- Name: ComisionAsignatura_idComisionAsignatura_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."ComisionAsignatura_idComisionAsignatura_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ComisionAsignatura_idComisionAsignatura_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."ComisionAsignatura_idComisionAsignatura_seq" OWNED BY public."ComisionAsignatura"."idComisionAsignatura";


--
-- Name: Comision_idComision_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Comision_idComision_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Comision_idComision_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Comision_idComision_seq" OWNED BY public."Comision"."idComision";


--
-- Name: Contactos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Contactos" (
    id integer NOT NULL,
    "personaId" integer NOT NULL,
    "tipoContactoId" integer NOT NULL,
    principal boolean NOT NULL,
    contacto character varying(45) NOT NULL,
    "usuarioAccion" integer,
    "tsCreacion" timestamp without time zone DEFAULT now(),
    "tsModificacion" timestamp without time zone DEFAULT now()
);


--
-- Name: Contactos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Contactos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Contactos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Contactos_id_seq" OWNED BY public."Contactos".id;


--
-- Name: DatosMedicos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."DatosMedicos" (
    "idDatosMedicos" integer NOT NULL,
    "personasId" integer NOT NULL,
    "grupoSanguineo" character varying(3) NOT NULL,
    alergias character varying(45),
    "aptitudFisica" boolean NOT NULL,
    seguro character varying(45) NOT NULL,
    "usuarioAccion" integer,
    "tsCreacion" timestamp without time zone DEFAULT now(),
    "tsModificacion" timestamp without time zone DEFAULT now()
);


--
-- Name: DatosMedicos_idDatosMedicos_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."DatosMedicos_idDatosMedicos_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: DatosMedicos_idDatosMedicos_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."DatosMedicos_idDatosMedicos_seq" OWNED BY public."DatosMedicos"."idDatosMedicos";


--
-- Name: LegajoRangos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LegajoRangos" (
    "idLegajoRangos" integer NOT NULL,
    "legajoId" integer NOT NULL,
    "rangosInstitucionalesId" integer,
    "usuarioAccion" integer,
    "tsCreacion" timestamp without time zone DEFAULT now(),
    "tsModificacion" timestamp without time zone DEFAULT now()
);


--
-- Name: LegajoRangos_idLegajoRangos_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."LegajoRangos_idLegajoRangos_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: LegajoRangos_idLegajoRangos_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."LegajoRangos_idLegajoRangos_seq" OWNED BY public."LegajoRangos"."idLegajoRangos";


--
-- Name: LegajoSedes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LegajoSedes" (
    "idSedeLegajo" integer NOT NULL,
    "sedesId" integer NOT NULL,
    "Legajo_id" integer NOT NULL,
    "esAutoridad" boolean NOT NULL,
    "usuarioAccion" integer,
    "tsCreacion" timestamp without time zone DEFAULT now(),
    "tsModificacion" timestamp without time zone DEFAULT now(),
    "esSedeBase" boolean NOT NULL
);


--
-- Name: LegajoSedes_idSedeLegajo_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."LegajoSedes_idSedeLegajo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: LegajoSedes_idSedeLegajo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."LegajoSedes_idSedeLegajo_seq" OWNED BY public."LegajoSedes"."idSedeLegajo";


--
-- Name: PACorrelativas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PACorrelativas" (
    id integer NOT NULL,
    "asignaturaId" integer NOT NULL,
    "paId" integer NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: PACorrelativas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PACorrelativas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PACorrelativas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PACorrelativas_id_seq" OWNED BY public."PACorrelativas".id;


--
-- Name: PlanAsignaturas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."PlanAsignaturas" (
    id integer NOT NULL,
    "asignaturaId" integer NOT NULL,
    "planId" integer NOT NULL,
    "rangoMinimoId" integer NOT NULL,
    "sedesId" integer NOT NULL,
    "presentismoPorc" double precision NOT NULL,
    "regularizacionProm" double precision NOT NULL,
    "finalAprobacion" integer NOT NULL,
    duracion double precision NOT NULL,
    regimen character varying(45) NOT NULL,
    modalidad character varying(45) NOT NULL,
    estado integer NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: PlanAsignaturas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."PlanAsignaturas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: PlanAsignaturas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."PlanAsignaturas_id_seq" OWNED BY public."PlanAsignaturas".id;


--
-- Name: TipoAutoridad; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TipoAutoridad" (
    id integer NOT NULL,
    descripcion character varying(45) NOT NULL,
    estado integer NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: TipoAutoridad_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."TipoAutoridad_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: TipoAutoridad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."TipoAutoridad_id_seq" OWNED BY public."TipoAutoridad".id;


--
-- Name: asignaturas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.asignaturas (
    id integer NOT NULL,
    nombre character varying(105) NOT NULL,
    estado integer NOT NULL,
    formato character varying(45) NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: asignaturas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.asignaturas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: asignaturas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.asignaturas_id_seq OWNED BY public.asignaturas.id;


--
-- Name: comisiones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.comisiones (
    "idComision" integer NOT NULL,
    "planAsignaturasId" integer NOT NULL,
    "aulaId" integer NOT NULL,
    nombre character varying(45) NOT NULL,
    modalidad character varying(45) NOT NULL,
    "cupoMaximo" integer NOT NULL,
    estado character varying(45) NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: comisiones_idComision_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."comisiones_idComision_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: comisiones_idComision_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."comisiones_idComision_seq" OWNED BY public.comisiones."idComision";


--
-- Name: legajos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.legajos (
    id integer NOT NULL,
    "personasId" integer NOT NULL,
    numero character varying(45) NOT NULL,
    estado integer NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: legajos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.legajos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: legajos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.legajos_id_seq OWNED BY public.legajos.id;


--
-- Name: personas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personas (
    id integer NOT NULL,
    "tdId" integer NOT NULL,
    nombre character varying(100) NOT NULL,
    apellido character varying(100) NOT NULL,
    "numeroDoc" integer NOT NULL,
    estado integer NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: personas_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.personas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: personas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.personas_id_seq OWNED BY public.personas.id;


--
-- Name: planes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.planes (
    id integer NOT NULL,
    "tipoPlanesIdTipoPlanes" integer NOT NULL,
    "ResolucionMinisterial" integer NOT NULL,
    nombre character varying(100) NOT NULL,
    descrip text,
    "vigenciaDde" timestamp without time zone NOT NULL,
    "vigenciaHta" timestamp without time zone NOT NULL,
    estado integer NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: planes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.planes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: planes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.planes_id_seq OWNED BY public.planes.id;


--
-- Name: rangos_institucionales; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rangos_institucionales (
    id integer NOT NULL,
    descripcion character varying(45) NOT NULL,
    "nivelJerarquia" integer NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: rangos_institucionales_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rangos_institucionales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rangos_institucionales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rangos_institucionales_id_seq OWNED BY public.rangos_institucionales.id;


--
-- Name: sedes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sedes (
    id integer NOT NULL,
    "tipoSedeId" integer NOT NULL,
    nombre character varying(100) NOT NULL,
    direccion character varying(200) NOT NULL,
    estado integer NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: sedes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sedes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sedes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sedes_id_seq OWNED BY public.sedes.id;


--
-- Name: tipoContacto; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."tipoContacto" (
    "idtipoContacto" integer NOT NULL,
    tipo character varying(45) NOT NULL,
    "usuarioAccion" integer,
    "tsCreacion" timestamp without time zone DEFAULT now(),
    "tsModificacion" timestamp without time zone DEFAULT now()
);


--
-- Name: tipoContacto_idtipoContacto_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."tipoContacto_idtipoContacto_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tipoContacto_idtipoContacto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."tipoContacto_idtipoContacto_seq" OWNED BY public."tipoContacto"."idtipoContacto";


--
-- Name: tipos_documento; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipos_documento (
    id integer NOT NULL,
    descripcion character varying(45) NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: tipos_documento_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipos_documento_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tipos_documento_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipos_documento_id_seq OWNED BY public.tipos_documento.id;


--
-- Name: tipos_planes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipos_planes (
    "idTipoPlanes" integer NOT NULL,
    descripcion character varying(100) NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: tipos_planes_idTipoPlanes_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."tipos_planes_idTipoPlanes_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tipos_planes_idTipoPlanes_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."tipos_planes_idTipoPlanes_seq" OWNED BY public.tipos_planes."idTipoPlanes";


--
-- Name: tipos_sedes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tipos_sedes (
    id integer NOT NULL,
    descripcion character varying(45) NOT NULL,
    "usuarioAccion" integer NOT NULL,
    "tsCreacion" timestamp without time zone DEFAULT now() NOT NULL,
    "tsModificacion" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: tipos_sedes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tipos_sedes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tipos_sedes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tipos_sedes_id_seq OWNED BY public.tipos_sedes.id;


--
-- Name: Aulas id_aula; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Aulas" ALTER COLUMN id_aula SET DEFAULT nextval('public."Aulas_id_aula_seq"'::regclass);


--
-- Name: AutoridadComision id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AutoridadComision" ALTER COLUMN id SET DEFAULT nextval('public."AutoridadComision_id_seq"'::regclass);


--
-- Name: Comision idComision; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comision" ALTER COLUMN "idComision" SET DEFAULT nextval('public."Comision_idComision_seq"'::regclass);


--
-- Name: ComisionAsignatura idComisionAsignatura; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ComisionAsignatura" ALTER COLUMN "idComisionAsignatura" SET DEFAULT nextval('public."ComisionAsignatura_idComisionAsignatura_seq"'::regclass);


--
-- Name: Contactos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contactos" ALTER COLUMN id SET DEFAULT nextval('public."Contactos_id_seq"'::regclass);


--
-- Name: DatosMedicos idDatosMedicos; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DatosMedicos" ALTER COLUMN "idDatosMedicos" SET DEFAULT nextval('public."DatosMedicos_idDatosMedicos_seq"'::regclass);


--
-- Name: LegajoRangos idLegajoRangos; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LegajoRangos" ALTER COLUMN "idLegajoRangos" SET DEFAULT nextval('public."LegajoRangos_idLegajoRangos_seq"'::regclass);


--
-- Name: LegajoSedes idSedeLegajo; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LegajoSedes" ALTER COLUMN "idSedeLegajo" SET DEFAULT nextval('public."LegajoSedes_idSedeLegajo_seq"'::regclass);


--
-- Name: PACorrelativas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PACorrelativas" ALTER COLUMN id SET DEFAULT nextval('public."PACorrelativas_id_seq"'::regclass);


--
-- Name: PlanAsignaturas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlanAsignaturas" ALTER COLUMN id SET DEFAULT nextval('public."PlanAsignaturas_id_seq"'::regclass);


--
-- Name: TipoAutoridad id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TipoAutoridad" ALTER COLUMN id SET DEFAULT nextval('public."TipoAutoridad_id_seq"'::regclass);


--
-- Name: asignaturas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignaturas ALTER COLUMN id SET DEFAULT nextval('public.asignaturas_id_seq'::regclass);


--
-- Name: comisiones idComision; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comisiones ALTER COLUMN "idComision" SET DEFAULT nextval('public."comisiones_idComision_seq"'::regclass);


--
-- Name: legajos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legajos ALTER COLUMN id SET DEFAULT nextval('public.legajos_id_seq'::regclass);


--
-- Name: personas id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personas ALTER COLUMN id SET DEFAULT nextval('public.personas_id_seq'::regclass);


--
-- Name: planes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planes ALTER COLUMN id SET DEFAULT nextval('public.planes_id_seq'::regclass);


--
-- Name: rangos_institucionales id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rangos_institucionales ALTER COLUMN id SET DEFAULT nextval('public.rangos_institucionales_id_seq'::regclass);


--
-- Name: sedes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sedes ALTER COLUMN id SET DEFAULT nextval('public.sedes_id_seq'::regclass);


--
-- Name: tipoContacto idtipoContacto; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."tipoContacto" ALTER COLUMN "idtipoContacto" SET DEFAULT nextval('public."tipoContacto_idtipoContacto_seq"'::regclass);


--
-- Name: tipos_documento id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_documento ALTER COLUMN id SET DEFAULT nextval('public.tipos_documento_id_seq'::regclass);


--
-- Name: tipos_planes idTipoPlanes; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_planes ALTER COLUMN "idTipoPlanes" SET DEFAULT nextval('public."tipos_planes_idTipoPlanes_seq"'::regclass);


--
-- Name: tipos_sedes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_sedes ALTER COLUMN id SET DEFAULT nextval('public.tipos_sedes_id_seq'::regclass);


--
-- Data for Name: Aulas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Aulas" (id_aula, "sedesId", aula, "esVirtual", "usuarioAccion", estado, "tsCreacion", "tsModificacion") FROM stdin;
1	1	Aula 1	0	1	1	2026-07-07 01:58:45.899042	2026-07-07 01:58:45.899042
2	1	Campus Virtual	1	1	1	2026-07-07 02:09:05.566803	2026-07-07 02:09:05.566803
3	2	Salon de Capacitacion	0	1	1	2026-07-07 02:09:23.322549	2026-07-07 02:09:23.322549
\.


--
-- Data for Name: AutoridadComision; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."AutoridadComision" (id, "tipoAutoridadId", "legajoId", "comisionId", "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	1	3	1	1	2026-07-07 03:30:21.387249	2026-07-07 03:30:49.66783
\.


--
-- Data for Name: Comision; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Comision" ("idComision", "Descripcion", "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	Comision A 2026 1C	1	2026-07-06 22:11:08.521056	2026-07-06 22:11:08.521056
2	Comision B 2026 1C	1	2026-07-06 22:11:21.611114	2026-07-06 22:11:21.611114
\.


--
-- Data for Name: ComisionAsignatura; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ComisionAsignatura" ("idComisionAsignatura", "planAsignaturasId", "aulaId", nombre, modalidad, "cupoMaximo", estado, "usuarioAccion", "tsCreacion", "tsModificacion", "idComision") FROM stdin;
1	1	2	Comision Materiales Peligrosos	Virtual	30	Activo	1	2026-07-07 03:05:50.902723	2026-07-07 03:05:50.902723	1
2	3	1	Rescate	Presencial	15	Activo	1	2026-07-07 03:06:33.337983	2026-07-07 03:06:33.337983	2
\.


--
-- Data for Name: Contactos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Contactos" (id, "personaId", "tipoContactoId", principal, contacto, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
2	1	1	t	1122334455	1	2026-07-05 23:16:42.028058	2026-07-05 23:16:42.028058
3	2	1	t	1122334455	1	2026-07-05 23:17:03.023635	2026-07-05 23:17:03.023635
4	3	1	t	1122334455	1	2026-07-05 23:17:09.237241	2026-07-05 23:17:09.237241
5	1	2	t	Juan@gmail.com	1	2026-07-05 23:17:34.166658	2026-07-05 23:17:34.166658
\.


--
-- Data for Name: DatosMedicos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."DatosMedicos" ("idDatosMedicos", "personasId", "grupoSanguineo", alergias, "aptitudFisica", seguro, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
3	2	O+	Ninguna	t	OSDE	1	2026-07-05 22:27:44.213386	2026-07-05 22:27:44.213386
2	1	A-	Penicilina	f	Swiss Medical	1	2026-07-05 22:27:34.891378	2026-07-05 22:29:15.408921
4	3	AB+	Ibuprofeno	t	Galeno	1	2026-07-05 22:30:50.282902	2026-07-05 22:30:50.282902
\.


--
-- Data for Name: LegajoRangos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LegajoRangos" ("idLegajoRangos", "legajoId", "rangosInstitucionalesId", "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	1	1	1	2026-07-06 04:07:20.069196	2026-07-06 04:07:20.069196
2	2	6	1	2026-07-06 04:09:32.322998	2026-07-06 04:09:32.322998
\.


--
-- Data for Name: LegajoSedes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LegajoSedes" ("idSedeLegajo", "sedesId", "Legajo_id", "esAutoridad", "usuarioAccion", "tsCreacion", "tsModificacion", "esSedeBase") FROM stdin;
1	1	1	t	1	2026-07-06 04:50:54.849665	2026-07-06 04:50:54.849665	t
2	4	2	f	1	2026-07-06 05:20:35.11998	2026-07-06 05:20:35.11998	f
\.


--
-- Data for Name: PACorrelativas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PACorrelativas" (id, "asignaturaId", "paId", "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	1	4	1	2026-07-07 04:58:02.644187	2026-07-07 04:58:02.644187
\.


--
-- Data for Name: PlanAsignaturas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."PlanAsignaturas" (id, "asignaturaId", "planId", "rangoMinimoId", "sedesId", "presentismoPorc", "regularizacionProm", "finalAprobacion", duracion, regimen, modalidad, estado, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	1	1	4	1	80	7	6	64	Cuatrimestral	Presencial	1	1	2026-07-07 01:54:11.13216	2026-07-07 01:54:11.13216
2	2	1	1	2	70	7	7	24	Cuatrimestral	Presencial	1	1	2026-07-07 01:54:59.696223	2026-07-07 01:54:59.696223
3	3	3	7	4	80	7	7	24	Anual	Prensencial	1	1	2026-07-07 01:55:37.954298	2026-07-07 01:55:37.954298
4	37	1	1	1	80	7	7	24	Cuatrimestral	Presencial	1	1	2026-07-07 04:57:38.225115	2026-07-07 04:57:38.225115
\.


--
-- Data for Name: TipoAutoridad; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TipoAutoridad" (id, descripcion, estado, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	Instructor Titular	1	1	2026-07-07 03:28:41.794161	2026-07-07 03:28:41.794161
2	Instructor Auxiliar	1	1	2026-07-07 03:28:51.750457	2026-07-07 03:28:51.750457
3	Encargado de Comision	1	1	2026-07-07 03:29:21.393071	2026-07-07 03:29:21.393071
\.


--
-- Data for Name: asignaturas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.asignaturas (id, nombre, estado, formato, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
2	Atención Prehospitalaria	1	Practica	1	2026-07-06 05:32:15.662127	2026-07-06 05:32:15.662127
3	Rescate	1	Practica	1	2026-07-06 05:32:35.815778	2026-07-06 05:32:35.815778
4	Comunicaciones	1	Taller	1	2026-07-06 05:33:04.714313	2026-07-06 05:33:04.714313
5	Vehículos De Emergencia	1	Teorica	1	2026-07-06 05:33:25.680854	2026-07-06 05:33:25.680854
1	Materiales Peligrosos I	1	Teorica	1	2026-07-06 05:31:50.630877	2026-07-07 04:55:28.395505
37	Materiales Peligrosos 2	1	Teorica	1	2026-07-07 04:56:41.889887	2026-07-07 04:56:41.889887
\.


--
-- Data for Name: comisiones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.comisiones ("idComision", "planAsignaturasId", "aulaId", nombre, modalidad, "cupoMaximo", estado, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
\.


--
-- Data for Name: legajos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.legajos (id, "personasId", numero, estado, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
2	2	LEG-002	1	1	2026-07-05 03:17:24.085218	2026-07-05 03:17:24.085218
1	1	LEG-001	1	1	2026-07-05 03:16:29.947314	2026-07-06 21:21:51.445815
3	3	LEG-003	1	1	2026-07-07 03:30:01.09841	2026-07-07 03:30:01.09841
\.


--
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.personas (id, "tdId", nombre, apellido, "numeroDoc", estado, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
2	1	Jose	Rodriguez	12345678	1	1	2026-07-05 03:14:33.540823	2026-07-06 21:23:59.492627
1	1	Juan	Perez	202223143	1	1	2026-07-05 02:35:14.318574	2026-07-06 21:23:54.738394
3	1	Martina	Gonzalez	38456789	1	1	2026-07-05 22:30:23.220514	2026-07-06 21:23:57.432593
\.


--
-- Data for Name: planes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.planes (id, "tipoPlanesIdTipoPlanes", "ResolucionMinisterial", nombre, descrip, "vigenciaDde", "vigenciaHta", estado, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	1	2026001	Plan De Formacion Inicial Bombero	Plan basico para aspirantes a bombero voluntario.	2026-01-02 00:00:00	2030-12-06 00:00:00	1	1	2026-07-07 01:34:54.086585	2026-07-07 01:34:54.086585
2	2	202602	Plan De Capacitacion Continua	Capacitacion anual para personal activo del cuerpo.	2026-04-01 00:00:00	2030-12-06 00:00:00	1	1	2026-07-07 01:35:54.436147	2026-07-07 01:35:54.436147
3	2	2026001	Plan De Especializacion En Rescate	Formacion orientada a tecnicas de rescate urbano y vehicular.	2026-02-06 00:00:00	2027-09-23 00:00:00	1	1	2026-07-07 01:36:55.233854	2026-07-07 01:36:55.233854
\.


--
-- Data for Name: rangos_institucionales; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	Bombero	1	1	2026-07-06 03:40:02.323424	2026-07-06 03:40:02.323424
2	Cabo	2	1	2026-07-06 03:40:19.61734	2026-07-06 03:40:19.61734
3	Cabo Primero	3	1	2026-07-06 03:40:30.294857	2026-07-06 03:40:30.294857
4	Sargento	4	1	2026-07-06 03:40:39.957696	2026-07-06 03:40:39.957696
5	Sargento Primero	5	1	2026-07-06 03:40:51.555355	2026-07-06 03:40:51.555355
6	Suboficial Principal	6	1	2026-07-06 03:41:00.955091	2026-07-06 03:41:00.955091
7	Suboficial Mayor	7	1	2026-07-06 03:41:12.554998	2026-07-06 03:41:12.554998
8	Oficial Ayudante	8	1	2026-07-06 03:41:21.250803	2026-07-06 03:41:21.250803
9	Oficial Inspector	9	1	2026-07-06 03:41:33.101194	2026-07-06 03:41:33.101194
10	Oficial Principal	10	1	2026-07-06 03:41:44.432066	2026-07-06 03:41:44.432066
11	Sub-Comandante	11	1	2026-07-06 03:41:57.355629	2026-07-06 03:41:57.355629
12	Comandante	12	1	2026-07-06 03:42:10.123047	2026-07-06 03:42:10.123047
13	Comandante Mayor	13	1	2026-07-06 03:42:19.307127	2026-07-06 03:42:19.307127
14	Comandante General	14	1	2026-07-06 03:42:27.141716	2026-07-06 03:42:27.141716
\.


--
-- Data for Name: sedes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sedes (id, "tipoSedeId", nombre, direccion, estado, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	1	Sede Central	Brandsen 567	1	1	2026-07-05 04:53:47.672499	2026-07-06 05:15:48.584695
2	1	Bomberos Voluntarios De Nueva Pompeya Y Barracas Sur	Iriarte 3520	1	1	2026-07-06 05:17:12.852419	2026-07-06 05:17:12.852419
3	1	Bomberos Voluntarios De San Telmo	Balcarce 1249	1	1	2026-07-06 05:17:49.690638	2026-07-06 05:17:49.690638
4	1	Bomberos Voluntarios De Villa Soldati	Tabaré 3294	1	1	2026-07-06 05:18:13.104928	2026-07-06 05:18:55.027141
5	1	Bomberos Voluntarios De Vuelta De Rocha	Garibaldi 2042/48	1	1	2026-07-06 05:20:02.382749	2026-07-06 05:20:02.382749
\.


--
-- Data for Name: tipoContacto; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."tipoContacto" ("idtipoContacto", tipo, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	Celular	1	2026-07-05 22:56:33.859913	2026-07-05 22:56:33.859913
2	Email	1	2026-07-05 22:57:21.667944	2026-07-05 22:57:21.667944
3	Whatsapp	1	2026-07-05 22:57:49.444912	2026-07-05 22:57:49.444912
4	Telefono Fijo	1	2026-07-05 22:58:17.49204	2026-07-05 22:58:17.49204
\.


--
-- Data for Name: tipos_documento; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tipos_documento (id, descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	Dni	1	2026-07-05 02:34:46.398369	2026-07-05 03:10:56.187263
3	Cedula	1	2026-07-05 03:11:34.164687	2026-07-05 03:11:34.164687
\.


--
-- Data for Name: tipos_planes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tipos_planes ("idTipoPlanes", descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	Formacion Inicial	1	2026-07-07 01:08:53.933584	2026-07-07 01:08:53.933584
2	Especializacion	1	2026-07-07 01:11:40.677887	2026-07-07 01:11:40.677887
3	Actualizacion Obligatoria	1	2026-07-07 01:11:50.881504	2026-07-07 01:11:50.881504
4	Ascenso Jerarquico	1	2026-07-07 01:12:11.253643	2026-07-07 01:12:11.253643
5	Instructorado	1	2026-07-07 01:12:44.38481	2026-07-07 01:12:44.38481
6	Reentrenamiento	1	2026-07-07 01:12:58.712361	2026-07-07 01:12:58.712361
\.


--
-- Data for Name: tipos_sedes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tipos_sedes (id, descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") FROM stdin;
1	Cuartel	1	2026-07-05 04:52:54.193872	2026-07-05 04:52:54.193872
\.


--
-- Name: Aulas_id_aula_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Aulas_id_aula_seq"', 3, true);


--
-- Name: AutoridadComision_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."AutoridadComision_id_seq"', 1, true);


--
-- Name: ComisionAsignatura_idComisionAsignatura_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."ComisionAsignatura_idComisionAsignatura_seq"', 2, true);


--
-- Name: Comision_idComision_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Comision_idComision_seq"', 2, true);


--
-- Name: Contactos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Contactos_id_seq"', 5, true);


--
-- Name: DatosMedicos_idDatosMedicos_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."DatosMedicos_idDatosMedicos_seq"', 4, true);


--
-- Name: LegajoRangos_idLegajoRangos_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."LegajoRangos_idLegajoRangos_seq"', 2, true);


--
-- Name: LegajoSedes_idSedeLegajo_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."LegajoSedes_idSedeLegajo_seq"', 2, true);


--
-- Name: PACorrelativas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PACorrelativas_id_seq"', 1, true);


--
-- Name: PlanAsignaturas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."PlanAsignaturas_id_seq"', 4, true);


--
-- Name: TipoAutoridad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."TipoAutoridad_id_seq"', 3, true);


--
-- Name: asignaturas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.asignaturas_id_seq', 37, true);


--
-- Name: comisiones_idComision_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."comisiones_idComision_seq"', 1, false);


--
-- Name: legajos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.legajos_id_seq', 3, true);


--
-- Name: personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.personas_id_seq', 3, true);


--
-- Name: planes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.planes_id_seq', 3, true);


--
-- Name: rangos_institucionales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rangos_institucionales_id_seq', 14, true);


--
-- Name: sedes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sedes_id_seq', 5, true);


--
-- Name: tipoContacto_idtipoContacto_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."tipoContacto_idtipoContacto_seq"', 4, true);


--
-- Name: tipos_documento_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tipos_documento_id_seq', 3, true);


--
-- Name: tipos_planes_idTipoPlanes_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."tipos_planes_idTipoPlanes_seq"', 6, true);


--
-- Name: tipos_sedes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tipos_sedes_id_seq', 1, true);


--
-- Name: Aulas Aulas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Aulas"
    ADD CONSTRAINT "Aulas_pkey" PRIMARY KEY (id_aula);


--
-- Name: AutoridadComision AutoridadComision_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AutoridadComision"
    ADD CONSTRAINT "AutoridadComision_pkey" PRIMARY KEY (id);


--
-- Name: ComisionAsignatura ComisionAsignatura_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ComisionAsignatura"
    ADD CONSTRAINT "ComisionAsignatura_pkey" PRIMARY KEY ("idComisionAsignatura");


--
-- Name: Comision Comision_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comision"
    ADD CONSTRAINT "Comision_pkey" PRIMARY KEY ("idComision");


--
-- Name: Contactos Contactos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contactos"
    ADD CONSTRAINT "Contactos_pkey" PRIMARY KEY (id);


--
-- Name: DatosMedicos DatosMedicos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DatosMedicos"
    ADD CONSTRAINT "DatosMedicos_pkey" PRIMARY KEY ("idDatosMedicos");


--
-- Name: LegajoRangos LegajoRangos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LegajoRangos"
    ADD CONSTRAINT "LegajoRangos_pkey" PRIMARY KEY ("idLegajoRangos");


--
-- Name: LegajoSedes LegajoSedes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LegajoSedes"
    ADD CONSTRAINT "LegajoSedes_pkey" PRIMARY KEY ("idSedeLegajo");


--
-- Name: PACorrelativas PACorrelativas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PACorrelativas"
    ADD CONSTRAINT "PACorrelativas_pkey" PRIMARY KEY (id);


--
-- Name: PlanAsignaturas PlanAsignaturas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlanAsignaturas"
    ADD CONSTRAINT "PlanAsignaturas_pkey" PRIMARY KEY (id);


--
-- Name: TipoAutoridad TipoAutoridad_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TipoAutoridad"
    ADD CONSTRAINT "TipoAutoridad_pkey" PRIMARY KEY (id);


--
-- Name: asignaturas asignaturas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.asignaturas
    ADD CONSTRAINT asignaturas_pkey PRIMARY KEY (id);


--
-- Name: comisiones comisiones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comisiones
    ADD CONSTRAINT comisiones_pkey PRIMARY KEY ("idComision");


--
-- Name: legajos legajos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legajos
    ADD CONSTRAINT legajos_pkey PRIMARY KEY (id);


--
-- Name: personas personas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT personas_pkey PRIMARY KEY (id);


--
-- Name: planes planes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planes
    ADD CONSTRAINT planes_pkey PRIMARY KEY (id);


--
-- Name: rangos_institucionales rangos_institucionales_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rangos_institucionales
    ADD CONSTRAINT rangos_institucionales_pkey PRIMARY KEY (id);


--
-- Name: sedes sedes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sedes
    ADD CONSTRAINT sedes_pkey PRIMARY KEY (id);


--
-- Name: tipoContacto tipoContacto_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."tipoContacto"
    ADD CONSTRAINT "tipoContacto_pkey" PRIMARY KEY ("idtipoContacto");


--
-- Name: tipos_documento tipos_documento_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_documento
    ADD CONSTRAINT tipos_documento_pkey PRIMARY KEY (id);


--
-- Name: tipos_planes tipos_planes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_planes
    ADD CONSTRAINT tipos_planes_pkey PRIMARY KEY ("idTipoPlanes");


--
-- Name: tipos_sedes tipos_sedes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tipos_sedes
    ADD CONSTRAINT tipos_sedes_pkey PRIMARY KEY (id);


--
-- Name: Aulas Aulas_sedesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Aulas"
    ADD CONSTRAINT "Aulas_sedesId_fkey" FOREIGN KEY ("sedesId") REFERENCES public.sedes(id);


--
-- Name: AutoridadComision AutoridadComision_comisionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AutoridadComision"
    ADD CONSTRAINT "AutoridadComision_comisionId_fkey" FOREIGN KEY ("comisionId") REFERENCES public."ComisionAsignatura"("idComisionAsignatura");


--
-- Name: AutoridadComision AutoridadComision_legajoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AutoridadComision"
    ADD CONSTRAINT "AutoridadComision_legajoId_fkey" FOREIGN KEY ("legajoId") REFERENCES public.legajos(id);


--
-- Name: AutoridadComision AutoridadComision_tipoAutoridadId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."AutoridadComision"
    ADD CONSTRAINT "AutoridadComision_tipoAutoridadId_fkey" FOREIGN KEY ("tipoAutoridadId") REFERENCES public."TipoAutoridad"(id);


--
-- Name: ComisionAsignatura ComisionAsignatura_aulaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ComisionAsignatura"
    ADD CONSTRAINT "ComisionAsignatura_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES public."Aulas"(id_aula);


--
-- Name: ComisionAsignatura ComisionAsignatura_idComision_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ComisionAsignatura"
    ADD CONSTRAINT "ComisionAsignatura_idComision_fkey" FOREIGN KEY ("idComision") REFERENCES public."Comision"("idComision");


--
-- Name: ComisionAsignatura ComisionAsignatura_planAsignaturasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ComisionAsignatura"
    ADD CONSTRAINT "ComisionAsignatura_planAsignaturasId_fkey" FOREIGN KEY ("planAsignaturasId") REFERENCES public."PlanAsignaturas"(id);


--
-- Name: Contactos Contactos_personaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contactos"
    ADD CONSTRAINT "Contactos_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES public.personas(id);


--
-- Name: Contactos Contactos_tipoContactoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Contactos"
    ADD CONSTRAINT "Contactos_tipoContactoId_fkey" FOREIGN KEY ("tipoContactoId") REFERENCES public."tipoContacto"("idtipoContacto");


--
-- Name: DatosMedicos DatosMedicos_personasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."DatosMedicos"
    ADD CONSTRAINT "DatosMedicos_personasId_fkey" FOREIGN KEY ("personasId") REFERENCES public.personas(id);


--
-- Name: LegajoRangos LegajoRangos_legajoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LegajoRangos"
    ADD CONSTRAINT "LegajoRangos_legajoId_fkey" FOREIGN KEY ("legajoId") REFERENCES public.legajos(id);


--
-- Name: LegajoRangos LegajoRangos_rangosInstitucionalesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LegajoRangos"
    ADD CONSTRAINT "LegajoRangos_rangosInstitucionalesId_fkey" FOREIGN KEY ("rangosInstitucionalesId") REFERENCES public.rangos_institucionales(id);


--
-- Name: LegajoSedes LegajoSedes_Legajo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LegajoSedes"
    ADD CONSTRAINT "LegajoSedes_Legajo_id_fkey" FOREIGN KEY ("Legajo_id") REFERENCES public.legajos(id);


--
-- Name: LegajoSedes LegajoSedes_sedesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LegajoSedes"
    ADD CONSTRAINT "LegajoSedes_sedesId_fkey" FOREIGN KEY ("sedesId") REFERENCES public.sedes(id);


--
-- Name: PACorrelativas PACorrelativas_asignaturaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PACorrelativas"
    ADD CONSTRAINT "PACorrelativas_asignaturaId_fkey" FOREIGN KEY ("asignaturaId") REFERENCES public.asignaturas(id);


--
-- Name: PACorrelativas PACorrelativas_paId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PACorrelativas"
    ADD CONSTRAINT "PACorrelativas_paId_fkey" FOREIGN KEY ("paId") REFERENCES public."PlanAsignaturas"(id);


--
-- Name: PlanAsignaturas PlanAsignaturas_asignaturaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlanAsignaturas"
    ADD CONSTRAINT "PlanAsignaturas_asignaturaId_fkey" FOREIGN KEY ("asignaturaId") REFERENCES public.asignaturas(id);


--
-- Name: PlanAsignaturas PlanAsignaturas_planId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlanAsignaturas"
    ADD CONSTRAINT "PlanAsignaturas_planId_fkey" FOREIGN KEY ("planId") REFERENCES public.planes(id);


--
-- Name: PlanAsignaturas PlanAsignaturas_sedesId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."PlanAsignaturas"
    ADD CONSTRAINT "PlanAsignaturas_sedesId_fkey" FOREIGN KEY ("sedesId") REFERENCES public.sedes(id);


--
-- Name: comisiones comisiones_aulaId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comisiones
    ADD CONSTRAINT "comisiones_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES public."Aulas"(id_aula);


--
-- Name: comisiones comisiones_planAsignaturasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.comisiones
    ADD CONSTRAINT "comisiones_planAsignaturasId_fkey" FOREIGN KEY ("planAsignaturasId") REFERENCES public."PlanAsignaturas"(id);


--
-- Name: legajos legajos_personasId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.legajos
    ADD CONSTRAINT "legajos_personasId_fkey" FOREIGN KEY ("personasId") REFERENCES public.personas(id);


--
-- Name: personas personas_tdId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT "personas_tdId_fkey" FOREIGN KEY ("tdId") REFERENCES public.tipos_documento(id);


--
-- Name: planes planes_tipoPlanesIdTipoPlanes_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planes
    ADD CONSTRAINT "planes_tipoPlanesIdTipoPlanes_fkey" FOREIGN KEY ("tipoPlanesIdTipoPlanes") REFERENCES public.tipos_planes("idTipoPlanes");


--
-- Name: sedes sedes_tipoSedeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sedes
    ADD CONSTRAINT "sedes_tipoSedeId_fkey" FOREIGN KEY ("tipoSedeId") REFERENCES public.tipos_sedes(id);


--
-- PostgreSQL database dump complete
--

\unrestrict J7Z4oQ3Gslop9zfwdcfHBTqDgJdKUfyWIwUdGXaV83nSftitsB2sxWYh2oWfuiF

