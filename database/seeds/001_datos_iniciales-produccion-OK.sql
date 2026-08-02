--
-- PostgreSQL database dump
--

--\restrict GHsy0q5JXkR3sqVf4Ab5oZ7srG7onwjdEArllazfBzxrDgp7zetZolDqfOiaVzk

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

-- 1. INSERT EN public.personas
INSERT INTO public.personas (id, "tdId", nombre, apellido, "numeroDoc", estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES 
(23, 1, 'Diego', 'Diego', 25296154, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(24, 1, 'Javier', 'Javier', 20771747, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(25, 1, 'Rebeca', 'Rebeca', 43238777, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(26, 1, 'Santiago', 'Santiago', 46581676, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(27, 1, 'Daniel', 'Daniel', 39344599, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(28, 1, 'Agustin', 'Agustin', 45819527, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(29, 1, 'Luis', 'Luis', 26230616, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(30, 1, 'Xoel', 'Xoel', 44553151, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(31, 1, 'Lucas', 'Lucas', 45977267, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(32, 1, 'Ignacio', 'Ignacio', 39210597, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(33, 1, 'Castellanos', 'Castellanos', 37386057, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(34, 1, 'Lema', 'Lema', 27930133, 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394');
--INSERT INTO public.personas (id, "tdId", nombre, apellido, "numeroDoc", estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (3, 1, 'Martina', 'Gonzalez', 38456789, 1, 1, '2026-07-05 22:30:23.220514', '2026-07-06 21:23:57.432593');


--
-- Data for Name: legajos; Type: TABLE DATA; Schema: public; Owner: -
--

--INSERT INTO public.legajos (id, "personasId", numero, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES (2, 2, 'LEG-002', 1, 1, '2026-07-05 03:17:24.085218', '2026-07-05 03:17:24.085218');
INSERT INTO public.legajos (id, "personasId", numero, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES 
(23, 23, 'LEG-003', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(24, 24, 'LEG-004', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(25, 25, 'LEG-005', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(26, 26, 'LEG-006', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(27, 27, 'LEG-007', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(28, 28, 'LEG-008', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(29, 29, 'LEG-009', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(30, 30, 'LEG-010', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(31, 31, 'LEG-011', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(32, 32, 'LEG-012', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(33, 33, 'LEG-013', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(34, 34, 'LEG-014', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394');

INSERT INTO public."Contactos" (id, "personaId", "tipoContactoId", principal, contacto, estado, "usuarioAccion", "tsCreacion", "tsModificacion") VALUES 
(23, 23, 2, true, 'diego.r.gallo@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(24, 24, 2, true, 'franciscojavierstevenin@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(25, 25, 2, true, 'rebeluna263@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(26, 26, 2, true, 'santyyoshi2005@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(27, 27, 2, true, 'danii.espindola96@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(28, 28, 2, true, 'agustinblancat@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(29, 29, 2, true, 'luis271277@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(30, 30, 2, true, 'xoelfernandezvega16@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(31, 31, 2, true, 'lucas22nic@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(32, 32, 2, true, 'ignacioaltamiranom23@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(33, 33, 2, true, 'ignaciocastellanos040794@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394'),
(34, 34, 2, true, 'lemarodrigo@gmail.com', 1, 1, '2026-07-05 02:35:14.318574', '2026-07-06 21:23:54.738394');


SELECT pg_catalog.setval('public."Contactos_id_seq"', 50, true);


--
-- Name: DatosMedicos_idDatosMedicos_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.legajos_id_seq', 50, true);


--
-- Name: personas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.personas_id_seq', 50, true);

