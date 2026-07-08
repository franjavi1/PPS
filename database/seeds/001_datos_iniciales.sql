--
-- PostgreSQL database dump
--

\restrict GHsy0q5JXkR3sqVf4Ab5oZ7srG7onwjdEArllazfBzxrDgp7zetZolDqfOiaVzk

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

--
-- Data for Name: tipos_sedes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tipos_sedes (id, descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 'Cuartel', 1, '2026-07-05 04:52:54.193872', '2026-07-05 04:52:54.193872');


--
-- Data for Name: sedes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.sedes (id, "tipoSedeId", nombre, direccion, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 1, 'Sede Central', 'Brandsen 567', 1, 1, '2026-07-05 04:53:47.672499', '2026-07-06 05:15:48.584695');
INSERT INTO public.sedes (id, "tipoSedeId", nombre, direccion, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 1, 'Bomberos Voluntarios De Nueva Pompeya Y Barracas Sur', 'Iriarte 3520', 1, 1, '2026-07-06 05:17:12.852419', '2026-07-06 05:17:12.852419');
INSERT INTO public.sedes (id, "tipoSedeId", nombre, direccion, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 1, 'Bomberos Voluntarios De San Telmo', 'Balcarce 1249', 1, 1, '2026-07-06 05:17:49.690638', '2026-07-06 05:17:49.690638');
INSERT INTO public.sedes (id, "tipoSedeId", nombre, direccion, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (4, 1, 'Bomberos Voluntarios De Villa Soldati', 'Tabaré 3294', 1, 1, '2026-07-06 05:18:13.104928', '2026-07-06 05:18:55.027141');
INSERT INTO public.sedes (id, "tipoSedeId", nombre, direccion, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (5, 1, 'Bomberos Voluntarios De Vuelta De Rocha', 'Garibaldi 2042/48', 1, 1, '2026-07-06 05:20:02.382749', '2026-07-06 05:20:02.382749');


--
-- Data for Name: Aulas; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Aulas" (id_aula, "sedesId", aula, "esVirtual", "usuarioAccion", estado, "tsCreacion", "tsModificacion") VALUES (1, 1, 'Aula 1', 0, 1, 1, '2026-07-07 01:58:45.899042', '2026-07-07 01:58:45.899042');
INSERT INTO public."Aulas" (id_aula, "sedesId", aula, "esVirtual", "usuarioAccion", estado, "tsCreacion", "tsModificacion") VALUES (2, 1, 'Campus Virtual', 1, 1, 1, '2026-07-07 02:09:05.566803', '2026-07-07 02:09:05.566803');
INSERT INTO public."Aulas" (id_aula, "sedesId", aula, "esVirtual", "usuarioAccion", estado, "tsCreacion", "tsModificacion") VALUES (3, 2, 'Salon de Capacitacion', 0, 1, 1, '2026-07-07 02:09:23.322549', '2026-07-07 02:09:23.322549');


--
-- Data for Name: Comision; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Comision" ("idComision", "Descripcion", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 'Comision A 2026 1C', 1, '2026-07-06 22:11:08.521056', '2026-07-06 22:11:08.521056');
INSERT INTO public."Comision" ("idComision", "Descripcion", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 'Comision B 2026 1C', 1, '2026-07-06 22:11:21.611114', '2026-07-06 22:11:21.611114');


--
-- Data for Name: asignaturas; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.asignaturas (id, nombre, estado, formato, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 'Atención Prehospitalaria', 1, 'Practica', 1, '2026-07-06 05:32:15.662127', '2026-07-06 05:32:15.662127');
INSERT INTO public.asignaturas (id, nombre, estado, formato, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 'Rescate', 1, 'Practica', 1, '2026-07-06 05:32:35.815778', '2026-07-06 05:32:35.815778');
INSERT INTO public.asignaturas (id, nombre, estado, formato, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (4, 'Comunicaciones', 1, 'Taller', 1, '2026-07-06 05:33:04.714313', '2026-07-06 05:33:04.714313');
INSERT INTO public.asignaturas (id, nombre, estado, formato, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (5, 'Vehículos De Emergencia', 1, 'Teorica', 1, '2026-07-06 05:33:25.680854', '2026-07-06 05:33:25.680854');
INSERT INTO public.asignaturas (id, nombre, estado, formato, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 'Materiales Peligrosos I', 1, 'Teorica', 1, '2026-07-06 05:31:50.630877', '2026-07-07 04:55:28.395505');
INSERT INTO public.asignaturas (id, nombre, estado, formato, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (37, 'Materiales Peligrosos 2', 1, 'Teorica', 1, '2026-07-07 04:56:41.889887', '2026-07-07 04:56:41.889887');


--
-- Data for Name: tipos_planes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tipos_planes ("idTipoPlanes", descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 'Formacion Inicial', 1, '2026-07-07 01:08:53.933584', '2026-07-07 01:08:53.933584');
INSERT INTO public.tipos_planes ("idTipoPlanes", descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 'Especializacion', 1, '2026-07-07 01:11:40.677887', '2026-07-07 01:11:40.677887');
INSERT INTO public.tipos_planes ("idTipoPlanes", descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 'Actualizacion Obligatoria', 1, '2026-07-07 01:11:50.881504', '2026-07-07 01:11:50.881504');
INSERT INTO public.tipos_planes ("idTipoPlanes", descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (4, 'Ascenso Jerarquico', 1, '2026-07-07 01:12:11.253643', '2026-07-07 01:12:11.253643');
INSERT INTO public.tipos_planes ("idTipoPlanes", descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (5, 'Instructorado', 1, '2026-07-07 01:12:44.38481', '2026-07-07 01:12:44.38481');
INSERT INTO public.tipos_planes ("idTipoPlanes", descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (6, 'Reentrenamiento', 1, '2026-07-07 01:12:58.712361', '2026-07-07 01:12:58.712361');


--
-- Data for Name: planes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.planes (id, "tipoPlanesIdTipoPlanes", "ResolucionMinisterial", nombre, descrip, "vigenciaDde", "vigenciaHta", estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 1, 2026001, 'Plan De Formacion Inicial Bombero', 'Plan basico para aspirantes a bombero voluntario.', '2026-01-02 00:00:00', '2030-12-06 00:00:00', 1, 1, '2026-07-07 01:34:54.086585', '2026-07-07 01:34:54.086585');
INSERT INTO public.planes (id, "tipoPlanesIdTipoPlanes", "ResolucionMinisterial", nombre, descrip, "vigenciaDde", "vigenciaHta", estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 2, 202602, 'Plan De Capacitacion Continua', 'Capacitacion anual para personal activo del cuerpo.', '2026-04-01 00:00:00', '2030-12-06 00:00:00', 1, 1, '2026-07-07 01:35:54.436147', '2026-07-07 01:35:54.436147');
INSERT INTO public.planes (id, "tipoPlanesIdTipoPlanes", "ResolucionMinisterial", nombre, descrip, "vigenciaDde", "vigenciaHta", estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 2, 2026001, 'Plan De Especializacion En Rescate', 'Formacion orientada a tecnicas de rescate urbano y vehicular.', '2026-02-06 00:00:00', '2027-09-23 00:00:00', 1, 1, '2026-07-07 01:36:55.233854', '2026-07-07 01:36:55.233854');


--
-- Data for Name: PlanAsignaturas; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PlanAsignaturas" (id, "asignaturaId", "planId", "rangoMinimoId", "sedesId", "presentismoPorc", "regularizacionProm", "finalAprobacion", duracion, regimen, modalidad, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 1, 1, 4, 1, 80, 7, 6, 64, 'Cuatrimestral', 'Presencial', 1, 1, '2026-07-07 01:54:11.13216', '2026-07-07 01:54:11.13216');
INSERT INTO public."PlanAsignaturas" (id, "asignaturaId", "planId", "rangoMinimoId", "sedesId", "presentismoPorc", "regularizacionProm", "finalAprobacion", duracion, regimen, modalidad, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 2, 1, 1, 2, 70, 7, 7, 24, 'Cuatrimestral', 'Presencial', 1, 1, '2026-07-07 01:54:59.696223', '2026-07-07 01:54:59.696223');
INSERT INTO public."PlanAsignaturas" (id, "asignaturaId", "planId", "rangoMinimoId", "sedesId", "presentismoPorc", "regularizacionProm", "finalAprobacion", duracion, regimen, modalidad, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 3, 3, 7, 4, 80, 7, 7, 24, 'Anual', 'Prensencial', 1, 1, '2026-07-07 01:55:37.954298', '2026-07-07 01:55:37.954298');
INSERT INTO public."PlanAsignaturas" (id, "asignaturaId", "planId", "rangoMinimoId", "sedesId", "presentismoPorc", "regularizacionProm", "finalAprobacion", duracion, regimen, modalidad, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (4, 37, 1, 1, 1, 80, 7, 7, 24, 'Cuatrimestral', 'Presencial', 1, 1, '2026-07-07 04:57:38.225115', '2026-07-07 04:57:38.225115');


--
-- Data for Name: ComisionAsignatura; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."ComisionAsignatura" ("idComisionAsignatura", "planAsignaturasId", "aulaId", nombre, modalidad, "cupoMaximo", estado, "usuarioAccion", "tsCreacion", "tsModificacion", "idComision") VALUES (1, 1, 2, 'Comision Materiales Peligrosos', 'Virtual', 30, 'Activo', 1, '2026-07-07 03:05:50.902723', '2026-07-07 03:05:50.902723', 1);
INSERT INTO public."ComisionAsignatura" ("idComisionAsignatura", "planAsignaturasId", "aulaId", nombre, modalidad, "cupoMaximo", estado, "usuarioAccion", "tsCreacion", "tsModificacion", "idComision") VALUES (2, 3, 1, 'Rescate', 'Presencial', 15, 'Activo', 1, '2026-07-07 03:06:33.337983', '2026-07-07 03:06:33.337983', 2);


--
-- Data for Name: TipoAutoridad; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."TipoAutoridad" (id, descripcion, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 'Instructor Titular', 1, 1, '2026-07-07 03:28:41.794161', '2026-07-07 03:28:41.794161');
INSERT INTO public."TipoAutoridad" (id, descripcion, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 'Instructor Auxiliar', 1, 1, '2026-07-07 03:28:51.750457', '2026-07-07 03:28:51.750457');
INSERT INTO public."TipoAutoridad" (id, descripcion, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 'Encargado de Comision', 1, 1, '2026-07-07 03:29:21.393071', '2026-07-07 03:29:21.393071');


--
-- Data for Name: tipos_documento; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tipos_documento (id, descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 'Dni', 1, '2026-07-05 02:34:46.398369', '2026-07-05 03:10:56.187263');
INSERT INTO public.tipos_documento (id, descripcion, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 'Cedula', 1, '2026-07-05 03:11:34.164687', '2026-07-05 03:11:34.164687');


--
-- Data for Name: personas; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.personas (id, "tdId", nombre, apellido, "numeroDoc", estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 1, 'Jose', 'Rodriguez', 12345678, 1, 1, '2026-07-05 03:14:33.540823', '2026-07-06 21:23:59.492627');
INSERT INTO public.personas (id, "tdId", nombre, apellido, "numeroDoc", estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 1, 'Juan', 'Perez', 202223143, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394');
INSERT INTO public.personas (id, "tdId", nombre, apellido, "numeroDoc", estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 1, 'Martina', 'Gonzalez', 38456789, 1, 1, '2026-07-05 22:30:23.220514', '2026-07-06 21:23:57.432593');


--
-- Data for Name: legajos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.legajos (id, "personasId", numero, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 2, 'LEG-002', 1, 1, '2026-07-05 03:17:24.085218', '2026-07-05 03:17:24.085218');
INSERT INTO public.legajos (id, "personasId", numero, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 1, 'LEG-001', 1, 1, '2026-07-05 03:16:29.947314', '2026-07-06 21:21:51.445815');
INSERT INTO public.legajos (id, "personasId", numero, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 3, 'LEG-003', 1, 1, '2026-07-07 03:30:01.09841', '2026-07-07 03:30:01.09841');


--
-- Data for Name: AutoridadComision; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."AutoridadComision" (id, "tipoAutoridadId", "legajoId", "comisionId", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 1, 3, 1, 1, '2026-07-07 03:30:21.387249', '2026-07-07 03:30:49.66783');


--
-- Data for Name: tipoContacto; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."tipoContacto" ("idtipoContacto", tipo, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 'Celular', 1, '2026-07-05 22:56:33.859913', '2026-07-05 22:56:33.859913');
INSERT INTO public."tipoContacto" ("idtipoContacto", tipo, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 'Email', 1, '2026-07-05 22:57:21.667944', '2026-07-05 22:57:21.667944');
INSERT INTO public."tipoContacto" ("idtipoContacto", tipo, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 'Whatsapp', 1, '2026-07-05 22:57:49.444912', '2026-07-05 22:57:49.444912');
INSERT INTO public."tipoContacto" ("idtipoContacto", tipo, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (4, 'Telefono Fijo', 1, '2026-07-05 22:58:17.49204', '2026-07-05 22:58:17.49204');


--
-- Data for Name: Contactos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Contactos" (id, "personaId", "tipoContactoId", principal, contacto, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 1, 1, true, '1122334455', 1, '2026-07-05 23:16:42.028058', '2026-07-05 23:16:42.028058');
INSERT INTO public."Contactos" (id, "personaId", "tipoContactoId", principal, contacto, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 2, 1, true, '1122334455', 1, '2026-07-05 23:17:03.023635', '2026-07-05 23:17:03.023635');
INSERT INTO public."Contactos" (id, "personaId", "tipoContactoId", principal, contacto, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (4, 3, 1, true, '1122334455', 1, '2026-07-05 23:17:09.237241', '2026-07-05 23:17:09.237241');
INSERT INTO public."Contactos" (id, "personaId", "tipoContactoId", principal, contacto, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (5, 1, 2, true, 'Juan@gmail.com', 1, '2026-07-05 23:17:34.166658', '2026-07-05 23:17:34.166658');


--
-- Data for Name: DatosMedicos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."DatosMedicos" ("idDatosMedicos", "personasId", "grupoSanguineo", alergias, "aptitudFisica", seguro, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 2, 'O+', 'Ninguna', true, 'OSDE', 1, '2026-07-05 22:27:44.213386', '2026-07-05 22:27:44.213386');
INSERT INTO public."DatosMedicos" ("idDatosMedicos", "personasId", "grupoSanguineo", alergias, "aptitudFisica", seguro, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 1, 'A-', 'Penicilina', false, 'Swiss Medical', 1, '2026-07-05 22:27:34.891378', '2026-07-05 22:29:15.408921');
INSERT INTO public."DatosMedicos" ("idDatosMedicos", "personasId", "grupoSanguineo", alergias, "aptitudFisica", seguro, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (4, 3, 'AB+', 'Ibuprofeno', true, 'Galeno', 1, '2026-07-05 22:30:50.282902', '2026-07-05 22:30:50.282902');


--
-- Data for Name: rangos_institucionales; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 'Bombero', 1, 1, '2026-07-06 03:40:02.323424', '2026-07-06 03:40:02.323424');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 'Cabo', 2, 1, '2026-07-06 03:40:19.61734', '2026-07-06 03:40:19.61734');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 'Cabo Primero', 3, 1, '2026-07-06 03:40:30.294857', '2026-07-06 03:40:30.294857');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (4, 'Sargento', 4, 1, '2026-07-06 03:40:39.957696', '2026-07-06 03:40:39.957696');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (5, 'Sargento Primero', 5, 1, '2026-07-06 03:40:51.555355', '2026-07-06 03:40:51.555355');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (6, 'Suboficial Principal', 6, 1, '2026-07-06 03:41:00.955091', '2026-07-06 03:41:00.955091');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (7, 'Suboficial Mayor', 7, 1, '2026-07-06 03:41:12.554998', '2026-07-06 03:41:12.554998');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (8, 'Oficial Ayudante', 8, 1, '2026-07-06 03:41:21.250803', '2026-07-06 03:41:21.250803');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (9, 'Oficial Inspector', 9, 1, '2026-07-06 03:41:33.101194', '2026-07-06 03:41:33.101194');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (10, 'Oficial Principal', 10, 1, '2026-07-06 03:41:44.432066', '2026-07-06 03:41:44.432066');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (11, 'Sub-Comandante', 11, 1, '2026-07-06 03:41:57.355629', '2026-07-06 03:41:57.355629');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (12, 'Comandante', 12, 1, '2026-07-06 03:42:10.123047', '2026-07-06 03:42:10.123047');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (13, 'Comandante Mayor', 13, 1, '2026-07-06 03:42:19.307127', '2026-07-06 03:42:19.307127');
INSERT INTO public.rangos_institucionales (id, descripcion, "nivelJerarquia", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (14, 'Comandante General', 14, 1, '2026-07-06 03:42:27.141716', '2026-07-06 03:42:27.141716');


--
-- Data for Name: LegajoRangos; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."LegajoRangos" ("idLegajoRangos", "legajoId", "rangosInstitucionalesId", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 1, 1, 1, '2026-07-06 04:07:20.069196', '2026-07-06 04:07:20.069196');
INSERT INTO public."LegajoRangos" ("idLegajoRangos", "legajoId", "rangosInstitucionalesId", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 2, 6, 1, '2026-07-06 04:09:32.322998', '2026-07-06 04:09:32.322998');


--
-- Data for Name: LegajoSedes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."LegajoSedes" ("idSedeLegajo", "sedesId", "Legajo_id", "esAutoridad", "usuarioAccion", "tsCreacion", "tsModificacion", "esSedeBase") VALUES (1, 1, 1, true, 1, '2026-07-06 04:50:54.849665', '2026-07-06 04:50:54.849665', true);
INSERT INTO public."LegajoSedes" ("idSedeLegajo", "sedesId", "Legajo_id", "esAutoridad", "usuarioAccion", "tsCreacion", "tsModificacion", "esSedeBase") VALUES (2, 4, 2, false, 1, '2026-07-06 05:20:35.11998', '2026-07-06 05:20:35.11998', false);


--
-- Data for Name: PACorrelativas; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."PACorrelativas" (id, "asignaturaId", "paId", "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (1, 1, 4, 1, '2026-07-07 04:58:02.644187', '2026-07-07 04:58:02.644187');


--
-- Data for Name: comisiones; Type: TABLE DATA; Schema: public; Owner: -
--



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
-- PostgreSQL database dump complete
--

\unrestrict GHsy0q5JXkR3sqVf4Ab5oZ7srG7onwjdEArllazfBzxrDgp7zetZolDqfOiaVzk

