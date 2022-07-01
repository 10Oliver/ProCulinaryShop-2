PGDMP         +                z            ProCulinaryShop    14.0    14.0 �    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    49906    ProCulinaryShop    DATABASE     m   CREATE DATABASE "ProCulinaryShop" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Spanish_Spain.1252';
 !   DROP DATABASE "ProCulinaryShop";
                postgres    false                       1255    50113 !   actualizar_producto_bitacora_p1()    FUNCTION       CREATE FUNCTION public.actualizar_producto_bitacora_p1() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE 
	total INT;
BEGIN
	total = (SELECT COUNT(id_producto)-1 FROM producto);
	INSERT INTO bitacora_producto (noticia) VALUES (CONCAT('Se actualizo el producto: ',
														  (SELECT nombre_producto FROM producto OFFSET total),
														   ' por el usuario: ',
	(SELECT nombre_empleado FROM empleado, producto WHERE empleado.id_empleado = producto.id_empleado AND producto.id_empleado = (SELECT id_empleado FROM producto WHERE id_producto = (SELECT id_producto FROM producto OFFSET total)) AND producto.id_producto = (SELECT id_producto FROM producto WHERE id_producto = (SELECT id_producto FROM producto OFFSET total)))));					 
	RETURN NULL;
END; 
$$;
 8   DROP FUNCTION public.actualizar_producto_bitacora_p1();
       public          postgres    false                       1255    50110    actualizarinventario(integer) 	   PROCEDURE     �  CREATE PROCEDURE public.actualizarinventario(IN id_comprar integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
	total INT; 
	contador INT;
	cantidad_detalle INT;
	producto_id INT;
BEGIN
	total = (SELECT COUNT(id_detalle_orden) FROM detalle_orden WHERE id_orden_compra = id_comprar);
	FOR contador in 1 .. total LOOP
		producto_id = (SELECT id_producto FROM detalle_orden WHERE id_orden_compra=id_comprar LIMIT 1 OFFSET contador-1);
		cantidad_detalle = (SELECT cantidad_producto_orden FROM detalle_orden WHERE detalle_orden.id_producto = producto_id AND detalle_orden.id_orden_compra = id_comprar);
		UPDATE producto SET cantidad = (SELECT cantidad FROM producto WHERE id_producto = producto_id) - cantidad_detalle WHERE id_producto = producto_id;
	END LOOP;
END; $$;
 C   DROP PROCEDURE public.actualizarinventario(IN id_comprar integer);
       public          postgres    false            �            1255    50106 m   agregar_noticia(integer, integer, integer, character varying, timestamp without time zone, character varying)    FUNCTION     �  CREATE FUNCTION public.agregar_noticia(id_producto integer, id_estado integer, id_tipo integer, titulo character varying, fecha timestamp without time zone, descripcion character varying) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO noticia (titulo_noticia, descripcion_noticia, fecha_final,id_estado_noticia, id_tipo_noticia,id_producto)
	VALUES (titulo,descripcion,fecha,id_estado,id_tipo,id_producto);
END;
$$;
 �   DROP FUNCTION public.agregar_noticia(id_producto integer, id_estado integer, id_tipo integer, titulo character varying, fecha timestamp without time zone, descripcion character varying);
       public          postgres    false                       1255    50111    anadir_producto_bitacora()    FUNCTION     �  CREATE FUNCTION public.anadir_producto_bitacora() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	INSERT INTO bitacora_producto (noticia) VALUES (CONCAT('Se añadio el producto : ',
														  (SELECT nombre_producto FROM producto WHERE id_producto = (SELECT MAX(id_producto) FROM producto)), ' por: ',
														  (SELECT nombre_empleado FROM empleado, producto WHERE empleado.id_empleado = producto.id_empleado AND producto.id_empleado = (SELECT id_empleado FROM producto WHERE id_producto = (SELECT MAX(id_producto) FROM producto)) AND producto.id_producto = (SELECT id_producto FROM producto WHERE id_producto = (SELECT MAX(id_producto) FROM producto))))); 
	RETURN NULL;
END; 
$$;
 1   DROP FUNCTION public.anadir_producto_bitacora();
       public          postgres    false            �            1255    50105 "   buscar_producto(character varying)    FUNCTION       CREATE FUNCTION public.buscar_producto(nombre_p character varying) RETURNS TABLE(nombre_producto1 character varying)
    LANGUAGE plpgsql
    AS $$		 
BEGIN
	RETURN QUERY
	SELECT nombre_producto FROM producto
	WHERE nombre_producto LIKE CONCAT('%',nombre_p,'%');
END;
$$;
 B   DROP FUNCTION public.buscar_producto(nombre_p character varying);
       public          postgres    false            �            1255    50107    calcular_subtotal(integer)    FUNCTION     0  CREATE FUNCTION public.calcular_subtotal(orden integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE 
	subtotal NUMERIC(6,2);
	contador INT;
BEGIN
		subtotal = 0.0;
		FOR contador in 1 .. (SELECT COUNT(id_producto) FROM detalle_orden WHERE id_orden_compra = orden) LOOP
		subtotal = subtotal + ((SELECT cantidad_producto_orden FROM detalle_orden WHERE id_orden_compra=orden LIMIT 1 OFFSET contador-1)*(SELECT precio_producto_orden FROM detalle_orden WHERE id_orden_compra=orden LIMIT 1 OFFSET contador-1));
		
	END LOOP;
	RETURN subtotal;	
END; 
$$;
 7   DROP FUNCTION public.calcular_subtotal(orden integer);
       public          postgres    false            �            1255    50108    completar_compra(integer) 	   PROCEDURE     �   CREATE PROCEDURE public.completar_compra(IN id_comprar integer)
    LANGUAGE plpgsql
    AS $$
DECLARE 
	factura INT;
begin
	UPDATE orden_compra SET id_estado_orden = 2 WHERE id_orden_compra = id_comprar;
	call actualizarInventario (id_comprar);
end; $$;
 ?   DROP PROCEDURE public.completar_compra(IN id_comprar integer);
       public          postgres    false            �            1255    50109 ^   crear_orden(integer, integer, character varying, timestamp without time zone, text[], integer) 	   PROCEDURE     g  CREATE PROCEDURE public.crear_orden(IN cliente integer, IN empleado integer, IN direcciones character varying, IN fecha timestamp without time zone, IN comprar1 text[], IN conteo integer)
    LANGUAGE plpgsql
    AS $$
DECLARE 
	producto INT;
	cantidad INT;	
	contador INT;
	factura INT;
	precio NUMERIC(6,2);
BEGIN
	INSERT INTO orden_compra (direccion,fecha_hora,id_cliente,id_estado_orden,id_empleado)
	VALUES (direcciones,fecha,cliente,1,empleado);
	factura := (SELECT max(id_orden_compra) FROM orden_compra);
	FOR contador in 1 .. conteo LOOP
		cantidad = comprar1[contador][1];
		producto = comprar1[contador][2];
		precio = (SELECT p.precio FROM producto as p WHERE p.id_producto = producto);
		INSERT INTO detalle_orden (cantidad_producto_orden,precio_producto_orden,id_producto,id_orden_compra)
		VALUES (cantidad, precio , producto,factura);
	END LOOP;
END; $$;
 �   DROP PROCEDURE public.crear_orden(IN cliente integer, IN empleado integer, IN direcciones character varying, IN fecha timestamp without time zone, IN comprar1 text[], IN conteo integer);
       public          postgres    false            �            1259    49908    cargo_empleado    TABLE     �   CREATE TABLE public.cargo_empleado (
    id_cargo_empleado integer NOT NULL,
    nombre_cargo character varying(80) NOT NULL
);
 "   DROP TABLE public.cargo_empleado;
       public         heap    postgres    false            �            1259    49907 $   cargo_empleado_id_cargo_empleado_seq    SEQUENCE     �   CREATE SEQUENCE public.cargo_empleado_id_cargo_empleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.cargo_empleado_id_cargo_empleado_seq;
       public          postgres    false    210            �           0    0 $   cargo_empleado_id_cargo_empleado_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.cargo_empleado_id_cargo_empleado_seq OWNED BY public.cargo_empleado.id_cargo_empleado;
          public          postgres    false    209            �            1259    49938 	   categoria    TABLE     �   CREATE TABLE public.categoria (
    id_categoria integer NOT NULL,
    nombre_categoria character varying(45) NOT NULL,
    imagen_categoria character varying NOT NULL
);
    DROP TABLE public.categoria;
       public         heap    postgres    false            �            1259    49937    categoria_id_categoria_seq    SEQUENCE     �   CREATE SEQUENCE public.categoria_id_categoria_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 1   DROP SEQUENCE public.categoria_id_categoria_seq;
       public          postgres    false    218            �           0    0    categoria_id_categoria_seq    SEQUENCE OWNED BY     Y   ALTER SEQUENCE public.categoria_id_categoria_seq OWNED BY public.categoria.id_categoria;
          public          postgres    false    217            �            1259    49993    cliente    TABLE     b  CREATE TABLE public.cliente (
    id_cliente integer NOT NULL,
    nombre_cliente character varying(80) NOT NULL,
    apellido_cliente character varying(80) NOT NULL,
    correo_cliente character varying(80) NOT NULL,
    telefono_cliente integer NOT NULL,
    direccion character varying(400) NOT NULL,
    dui character varying(10) NOT NULL,
    visto boolean NOT NULL,
    usuario_cliente character varying(80) NOT NULL,
    contrasena_cliente character varying(100) NOT NULL,
    intento_cliente integer NOT NULL,
    hora_unlock_cliente timestamp without time zone,
    estado_cliente boolean NOT NULL
);
    DROP TABLE public.cliente;
       public         heap    postgres    false            �            1259    49992    cliente_id_cliente_seq    SEQUENCE     �   CREATE SEQUENCE public.cliente_id_cliente_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.cliente_id_cliente_seq;
       public          postgres    false    232            �           0    0    cliente_id_cliente_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.cliente_id_cliente_seq OWNED BY public.cliente.id_cliente;
          public          postgres    false    231            �            1259    50009    detalle_orden    TABLE     �   CREATE TABLE public.detalle_orden (
    id_detalle_orden integer NOT NULL,
    cantidad_producto_orden integer NOT NULL,
    precio_producto_orden numeric(6,2) NOT NULL,
    id_producto integer NOT NULL,
    id_orden_compra integer NOT NULL
);
 !   DROP TABLE public.detalle_orden;
       public         heap    postgres    false            �            1259    50008 "   detalle_orden_id_detalle_orden_seq    SEQUENCE     �   CREATE SEQUENCE public.detalle_orden_id_detalle_orden_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.detalle_orden_id_detalle_orden_seq;
       public          postgres    false    236            �           0    0 "   detalle_orden_id_detalle_orden_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.detalle_orden_id_detalle_orden_seq OWNED BY public.detalle_orden.id_detalle_orden;
          public          postgres    false    235            �            1259    49922    empleado    TABLE     �  CREATE TABLE public.empleado (
    id_empleado integer NOT NULL,
    dui character varying(10) NOT NULL,
    nombre_empleado character varying(80) NOT NULL,
    apellido_empleado character varying(80) NOT NULL,
    telefono_empleado integer NOT NULL,
    correo_empleado character varying(60) NOT NULL,
    direccion_empleado character varying(300) NOT NULL,
    usuario_empleado character varying(80) NOT NULL,
    contrasena_empleado character varying(100) NOT NULL,
    intento_empleado integer NOT NULL,
    hora_unlock_empleado timestamp without time zone,
    id_cargo_empleado integer NOT NULL,
    id_estado_empleado integer NOT NULL
);
    DROP TABLE public.empleado;
       public         heap    postgres    false            �            1259    49921    empleado_id_empleado_seq    SEQUENCE     �   CREATE SEQUENCE public.empleado_id_empleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.empleado_id_empleado_seq;
       public          postgres    false    214            �           0    0    empleado_id_empleado_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.empleado_id_empleado_seq OWNED BY public.empleado.id_empleado;
          public          postgres    false    213            �            1259    49915    estado_empleado    TABLE     �   CREATE TABLE public.estado_empleado (
    id_estado_empleado integer NOT NULL,
    estado_empleado character varying(45) NOT NULL
);
 #   DROP TABLE public.estado_empleado;
       public         heap    postgres    false            �            1259    49914 &   estado_empleado_id_estado_empleado_seq    SEQUENCE     �   CREATE SEQUENCE public.estado_empleado_id_estado_empleado_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.estado_empleado_id_estado_empleado_seq;
       public          postgres    false    212            �           0    0 &   estado_empleado_id_estado_empleado_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.estado_empleado_id_estado_empleado_seq OWNED BY public.estado_empleado.id_estado_empleado;
          public          postgres    false    211            �            1259    49970    estado_noticia    TABLE     �   CREATE TABLE public.estado_noticia (
    id_estado_noticia integer NOT NULL,
    estado_noticia character varying(30) NOT NULL
);
 "   DROP TABLE public.estado_noticia;
       public         heap    postgres    false            �            1259    49969 $   estado_noticia_id_estado_noticia_seq    SEQUENCE     �   CREATE SEQUENCE public.estado_noticia_id_estado_noticia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 ;   DROP SEQUENCE public.estado_noticia_id_estado_noticia_seq;
       public          postgres    false    226            �           0    0 $   estado_noticia_id_estado_noticia_seq    SEQUENCE OWNED BY     m   ALTER SEQUENCE public.estado_noticia_id_estado_noticia_seq OWNED BY public.estado_noticia.id_estado_noticia;
          public          postgres    false    225            �            1259    49986    estado_orden    TABLE     |   CREATE TABLE public.estado_orden (
    id_estado_orden integer NOT NULL,
    estado_orden character varying(45) NOT NULL
);
     DROP TABLE public.estado_orden;
       public         heap    postgres    false            �            1259    49985     estado_orden_id_estado_orden_seq    SEQUENCE     �   CREATE SEQUENCE public.estado_orden_id_estado_orden_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.estado_orden_id_estado_orden_seq;
       public          postgres    false    230            �           0    0     estado_orden_id_estado_orden_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.estado_orden_id_estado_orden_seq OWNED BY public.estado_orden.id_estado_orden;
          public          postgres    false    229            �            1259    49931    estado_producto    TABLE     �   CREATE TABLE public.estado_producto (
    id_estado_producto integer NOT NULL,
    estado_producto character varying(30) NOT NULL
);
 #   DROP TABLE public.estado_producto;
       public         heap    postgres    false            �            1259    49930 &   estado_producto_id_estado_producto_seq    SEQUENCE     �   CREATE SEQUENCE public.estado_producto_id_estado_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 =   DROP SEQUENCE public.estado_producto_id_estado_producto_seq;
       public          postgres    false    216            �           0    0 &   estado_producto_id_estado_producto_seq    SEQUENCE OWNED BY     q   ALTER SEQUENCE public.estado_producto_id_estado_producto_seq OWNED BY public.estado_producto.id_estado_producto;
          public          postgres    false    215            �            1259    50016    estado_resena    TABLE        CREATE TABLE public.estado_resena (
    id_estado_resena integer NOT NULL,
    estado_resena character varying(40) NOT NULL
);
 !   DROP TABLE public.estado_resena;
       public         heap    postgres    false            �            1259    50015 "   estado_resena_id_estado_resena_seq    SEQUENCE     �   CREATE SEQUENCE public.estado_resena_id_estado_resena_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 9   DROP SEQUENCE public.estado_resena_id_estado_resena_seq;
       public          postgres    false    238            �           0    0 "   estado_resena_id_estado_resena_seq    SEQUENCE OWNED BY     i   ALTER SEQUENCE public.estado_resena_id_estado_resena_seq OWNED BY public.estado_resena.id_estado_resena;
          public          postgres    false    237            �            1259    49947    material    TABLE     g   CREATE TABLE public.material (
    id_material integer NOT NULL,
    material character varying(30)
);
    DROP TABLE public.material;
       public         heap    postgres    false            �            1259    49946    material_id_material_seq    SEQUENCE     �   CREATE SEQUENCE public.material_id_material_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.material_id_material_seq;
       public          postgres    false    220            �           0    0    material_id_material_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.material_id_material_seq OWNED BY public.material.id_material;
          public          postgres    false    219            �            1259    49977    noticia    TABLE     t  CREATE TABLE public.noticia (
    id_noticia integer NOT NULL,
    titulo_noticia character varying(100) NOT NULL,
    descripcion_noticia character varying(400) NOT NULL,
    fecha_final timestamp without time zone NOT NULL,
    id_estado_noticia integer NOT NULL,
    id_tipo_noticia integer NOT NULL,
    id_producto integer NOT NULL,
    descuento integer NOT NULL
);
    DROP TABLE public.noticia;
       public         heap    postgres    false            �            1259    49976    noticia_id_noticia_seq    SEQUENCE     �   CREATE SEQUENCE public.noticia_id_noticia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.noticia_id_noticia_seq;
       public          postgres    false    228            �           0    0    noticia_id_noticia_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.noticia_id_noticia_seq OWNED BY public.noticia.id_noticia;
          public          postgres    false    227            �            1259    50002    orden_compra    TABLE       CREATE TABLE public.orden_compra (
    id_orden_compra integer NOT NULL,
    direccion character varying(400) NOT NULL,
    fecha_hora timestamp without time zone NOT NULL,
    id_cliente integer NOT NULL,
    id_estado_orden integer NOT NULL,
    id_empleado integer NOT NULL
);
     DROP TABLE public.orden_compra;
       public         heap    postgres    false            �            1259    50001     orden_compra_id_orden_compra_seq    SEQUENCE     �   CREATE SEQUENCE public.orden_compra_id_orden_compra_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.orden_compra_id_orden_compra_seq;
       public          postgres    false    234            �           0    0     orden_compra_id_orden_compra_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.orden_compra_id_orden_compra_seq OWNED BY public.orden_compra.id_orden_compra;
          public          postgres    false    233            �            1259    49954    producto    TABLE     �  CREATE TABLE public.producto (
    id_producto integer NOT NULL,
    nombre_producto character varying(120) NOT NULL,
    cantidad integer NOT NULL,
    descripcion character varying(300) NOT NULL,
    precio numeric(6,2) NOT NULL,
    descuento integer NOT NULL,
    imagen character varying,
    id_categoria integer NOT NULL,
    id_estado_producto integer NOT NULL,
    id_material integer NOT NULL,
    id_empleado integer NOT NULL
);
    DROP TABLE public.producto;
       public         heap    postgres    false            �            1259    49953    producto_id_producto_seq    SEQUENCE     �   CREATE SEQUENCE public.producto_id_producto_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.producto_id_producto_seq;
       public          postgres    false    222            �           0    0    producto_id_producto_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.producto_id_producto_seq OWNED BY public.producto.id_producto;
          public          postgres    false    221            �            1259    50023    resena    TABLE       CREATE TABLE public.resena (
    id_resena integer NOT NULL,
    resena character varying(400) NOT NULL,
    calificacion integer NOT NULL,
    fecha_resena timestamp without time zone NOT NULL,
    id_estado_resena integer NOT NULL,
    id_detalle_orden integer NOT NULL
);
    DROP TABLE public.resena;
       public         heap    postgres    false            �            1259    50022    resena_id_resena_seq    SEQUENCE     �   CREATE SEQUENCE public.resena_id_resena_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.resena_id_resena_seq;
       public          postgres    false    240            �           0    0    resena_id_resena_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.resena_id_resena_seq OWNED BY public.resena.id_resena;
          public          postgres    false    239            �            1259    49963    tipo_noticia    TABLE     |   CREATE TABLE public.tipo_noticia (
    id_tipo_noticia integer NOT NULL,
    tipo_noticia character varying(45) NOT NULL
);
     DROP TABLE public.tipo_noticia;
       public         heap    postgres    false            �            1259    49962     tipo_noticia_id_tipo_noticia_seq    SEQUENCE     �   CREATE SEQUENCE public.tipo_noticia_id_tipo_noticia_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 7   DROP SEQUENCE public.tipo_noticia_id_tipo_noticia_seq;
       public          postgres    false    224            �           0    0     tipo_noticia_id_tipo_noticia_seq    SEQUENCE OWNED BY     e   ALTER SEQUENCE public.tipo_noticia_id_tipo_noticia_seq OWNED BY public.tipo_noticia.id_tipo_noticia;
          public          postgres    false    223            �           2604    49911     cargo_empleado id_cargo_empleado    DEFAULT     �   ALTER TABLE ONLY public.cargo_empleado ALTER COLUMN id_cargo_empleado SET DEFAULT nextval('public.cargo_empleado_id_cargo_empleado_seq'::regclass);
 O   ALTER TABLE public.cargo_empleado ALTER COLUMN id_cargo_empleado DROP DEFAULT;
       public          postgres    false    210    209    210            �           2604    49941    categoria id_categoria    DEFAULT     �   ALTER TABLE ONLY public.categoria ALTER COLUMN id_categoria SET DEFAULT nextval('public.categoria_id_categoria_seq'::regclass);
 E   ALTER TABLE public.categoria ALTER COLUMN id_categoria DROP DEFAULT;
       public          postgres    false    217    218    218            �           2604    49996    cliente id_cliente    DEFAULT     x   ALTER TABLE ONLY public.cliente ALTER COLUMN id_cliente SET DEFAULT nextval('public.cliente_id_cliente_seq'::regclass);
 A   ALTER TABLE public.cliente ALTER COLUMN id_cliente DROP DEFAULT;
       public          postgres    false    232    231    232            �           2604    50012    detalle_orden id_detalle_orden    DEFAULT     �   ALTER TABLE ONLY public.detalle_orden ALTER COLUMN id_detalle_orden SET DEFAULT nextval('public.detalle_orden_id_detalle_orden_seq'::regclass);
 M   ALTER TABLE public.detalle_orden ALTER COLUMN id_detalle_orden DROP DEFAULT;
       public          postgres    false    235    236    236            �           2604    49925    empleado id_empleado    DEFAULT     |   ALTER TABLE ONLY public.empleado ALTER COLUMN id_empleado SET DEFAULT nextval('public.empleado_id_empleado_seq'::regclass);
 C   ALTER TABLE public.empleado ALTER COLUMN id_empleado DROP DEFAULT;
       public          postgres    false    214    213    214            �           2604    49918 "   estado_empleado id_estado_empleado    DEFAULT     �   ALTER TABLE ONLY public.estado_empleado ALTER COLUMN id_estado_empleado SET DEFAULT nextval('public.estado_empleado_id_estado_empleado_seq'::regclass);
 Q   ALTER TABLE public.estado_empleado ALTER COLUMN id_estado_empleado DROP DEFAULT;
       public          postgres    false    212    211    212            �           2604    49973     estado_noticia id_estado_noticia    DEFAULT     �   ALTER TABLE ONLY public.estado_noticia ALTER COLUMN id_estado_noticia SET DEFAULT nextval('public.estado_noticia_id_estado_noticia_seq'::regclass);
 O   ALTER TABLE public.estado_noticia ALTER COLUMN id_estado_noticia DROP DEFAULT;
       public          postgres    false    225    226    226            �           2604    49989    estado_orden id_estado_orden    DEFAULT     �   ALTER TABLE ONLY public.estado_orden ALTER COLUMN id_estado_orden SET DEFAULT nextval('public.estado_orden_id_estado_orden_seq'::regclass);
 K   ALTER TABLE public.estado_orden ALTER COLUMN id_estado_orden DROP DEFAULT;
       public          postgres    false    230    229    230            �           2604    49934 "   estado_producto id_estado_producto    DEFAULT     �   ALTER TABLE ONLY public.estado_producto ALTER COLUMN id_estado_producto SET DEFAULT nextval('public.estado_producto_id_estado_producto_seq'::regclass);
 Q   ALTER TABLE public.estado_producto ALTER COLUMN id_estado_producto DROP DEFAULT;
       public          postgres    false    215    216    216            �           2604    50019    estado_resena id_estado_resena    DEFAULT     �   ALTER TABLE ONLY public.estado_resena ALTER COLUMN id_estado_resena SET DEFAULT nextval('public.estado_resena_id_estado_resena_seq'::regclass);
 M   ALTER TABLE public.estado_resena ALTER COLUMN id_estado_resena DROP DEFAULT;
       public          postgres    false    238    237    238            �           2604    49950    material id_material    DEFAULT     |   ALTER TABLE ONLY public.material ALTER COLUMN id_material SET DEFAULT nextval('public.material_id_material_seq'::regclass);
 C   ALTER TABLE public.material ALTER COLUMN id_material DROP DEFAULT;
       public          postgres    false    220    219    220            �           2604    49980    noticia id_noticia    DEFAULT     x   ALTER TABLE ONLY public.noticia ALTER COLUMN id_noticia SET DEFAULT nextval('public.noticia_id_noticia_seq'::regclass);
 A   ALTER TABLE public.noticia ALTER COLUMN id_noticia DROP DEFAULT;
       public          postgres    false    227    228    228            �           2604    50005    orden_compra id_orden_compra    DEFAULT     �   ALTER TABLE ONLY public.orden_compra ALTER COLUMN id_orden_compra SET DEFAULT nextval('public.orden_compra_id_orden_compra_seq'::regclass);
 K   ALTER TABLE public.orden_compra ALTER COLUMN id_orden_compra DROP DEFAULT;
       public          postgres    false    234    233    234            �           2604    49957    producto id_producto    DEFAULT     |   ALTER TABLE ONLY public.producto ALTER COLUMN id_producto SET DEFAULT nextval('public.producto_id_producto_seq'::regclass);
 C   ALTER TABLE public.producto ALTER COLUMN id_producto DROP DEFAULT;
       public          postgres    false    221    222    222            �           2604    50026    resena id_resena    DEFAULT     t   ALTER TABLE ONLY public.resena ALTER COLUMN id_resena SET DEFAULT nextval('public.resena_id_resena_seq'::regclass);
 ?   ALTER TABLE public.resena ALTER COLUMN id_resena DROP DEFAULT;
       public          postgres    false    240    239    240            �           2604    49966    tipo_noticia id_tipo_noticia    DEFAULT     �   ALTER TABLE ONLY public.tipo_noticia ALTER COLUMN id_tipo_noticia SET DEFAULT nextval('public.tipo_noticia_id_tipo_noticia_seq'::regclass);
 K   ALTER TABLE public.tipo_noticia ALTER COLUMN id_tipo_noticia DROP DEFAULT;
       public          postgres    false    223    224    224            |          0    49908    cargo_empleado 
   TABLE DATA           I   COPY public.cargo_empleado (id_cargo_empleado, nombre_cargo) FROM stdin;
    public          postgres    false    210   ��       �          0    49938 	   categoria 
   TABLE DATA           U   COPY public.categoria (id_categoria, nombre_categoria, imagen_categoria) FROM stdin;
    public          postgres    false    218   D�       �          0    49993    cliente 
   TABLE DATA           �   COPY public.cliente (id_cliente, nombre_cliente, apellido_cliente, correo_cliente, telefono_cliente, direccion, dui, visto, usuario_cliente, contrasena_cliente, intento_cliente, hora_unlock_cliente, estado_cliente) FROM stdin;
    public          postgres    false    232   ��       �          0    50009    detalle_orden 
   TABLE DATA           �   COPY public.detalle_orden (id_detalle_orden, cantidad_producto_orden, precio_producto_orden, id_producto, id_orden_compra) FROM stdin;
    public          postgres    false    236   ��       �          0    49922    empleado 
   TABLE DATA             COPY public.empleado (id_empleado, dui, nombre_empleado, apellido_empleado, telefono_empleado, correo_empleado, direccion_empleado, usuario_empleado, contrasena_empleado, intento_empleado, hora_unlock_empleado, id_cargo_empleado, id_estado_empleado) FROM stdin;
    public          postgres    false    214   ��       ~          0    49915    estado_empleado 
   TABLE DATA           N   COPY public.estado_empleado (id_estado_empleado, estado_empleado) FROM stdin;
    public          postgres    false    212   G�       �          0    49970    estado_noticia 
   TABLE DATA           K   COPY public.estado_noticia (id_estado_noticia, estado_noticia) FROM stdin;
    public          postgres    false    226   ��       �          0    49986    estado_orden 
   TABLE DATA           E   COPY public.estado_orden (id_estado_orden, estado_orden) FROM stdin;
    public          postgres    false    230   ��       �          0    49931    estado_producto 
   TABLE DATA           N   COPY public.estado_producto (id_estado_producto, estado_producto) FROM stdin;
    public          postgres    false    216   ��       �          0    50016    estado_resena 
   TABLE DATA           H   COPY public.estado_resena (id_estado_resena, estado_resena) FROM stdin;
    public          postgres    false    238   1�       �          0    49947    material 
   TABLE DATA           9   COPY public.material (id_material, material) FROM stdin;
    public          postgres    false    220   c�       �          0    49977    noticia 
   TABLE DATA           �   COPY public.noticia (id_noticia, titulo_noticia, descripcion_noticia, fecha_final, id_estado_noticia, id_tipo_noticia, id_producto, descuento) FROM stdin;
    public          postgres    false    228   ��       �          0    50002    orden_compra 
   TABLE DATA           x   COPY public.orden_compra (id_orden_compra, direccion, fecha_hora, id_cliente, id_estado_orden, id_empleado) FROM stdin;
    public          postgres    false    234   ��       �          0    49954    producto 
   TABLE DATA           �   COPY public.producto (id_producto, nombre_producto, cantidad, descripcion, precio, descuento, imagen, id_categoria, id_estado_producto, id_material, id_empleado) FROM stdin;
    public          postgres    false    222   ��       �          0    50023    resena 
   TABLE DATA           s   COPY public.resena (id_resena, resena, calificacion, fecha_resena, id_estado_resena, id_detalle_orden) FROM stdin;
    public          postgres    false    240   �       �          0    49963    tipo_noticia 
   TABLE DATA           E   COPY public.tipo_noticia (id_tipo_noticia, tipo_noticia) FROM stdin;
    public          postgres    false    224   n�       �           0    0 $   cargo_empleado_id_cargo_empleado_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.cargo_empleado_id_cargo_empleado_seq', 5, true);
          public          postgres    false    209            �           0    0    categoria_id_categoria_seq    SEQUENCE SET     H   SELECT pg_catalog.setval('public.categoria_id_categoria_seq', 4, true);
          public          postgres    false    217            �           0    0    cliente_id_cliente_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.cliente_id_cliente_seq', 9, true);
          public          postgres    false    231            �           0    0 "   detalle_orden_id_detalle_orden_seq    SEQUENCE SET     Q   SELECT pg_catalog.setval('public.detalle_orden_id_detalle_orden_seq', 32, true);
          public          postgres    false    235            �           0    0    empleado_id_empleado_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.empleado_id_empleado_seq', 10, true);
          public          postgres    false    213            �           0    0 &   estado_empleado_id_estado_empleado_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.estado_empleado_id_estado_empleado_seq', 4, true);
          public          postgres    false    211            �           0    0 $   estado_noticia_id_estado_noticia_seq    SEQUENCE SET     R   SELECT pg_catalog.setval('public.estado_noticia_id_estado_noticia_seq', 2, true);
          public          postgres    false    225            �           0    0     estado_orden_id_estado_orden_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.estado_orden_id_estado_orden_seq', 2, true);
          public          postgres    false    229            �           0    0 &   estado_producto_id_estado_producto_seq    SEQUENCE SET     T   SELECT pg_catalog.setval('public.estado_producto_id_estado_producto_seq', 3, true);
          public          postgres    false    215            �           0    0 "   estado_resena_id_estado_resena_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('public.estado_resena_id_estado_resena_seq', 2, true);
          public          postgres    false    237            �           0    0    material_id_material_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.material_id_material_seq', 10, true);
          public          postgres    false    219            �           0    0    noticia_id_noticia_seq    SEQUENCE SET     D   SELECT pg_catalog.setval('public.noticia_id_noticia_seq', 9, true);
          public          postgres    false    227            �           0    0     orden_compra_id_orden_compra_seq    SEQUENCE SET     O   SELECT pg_catalog.setval('public.orden_compra_id_orden_compra_seq', 10, true);
          public          postgres    false    233            �           0    0    producto_id_producto_seq    SEQUENCE SET     G   SELECT pg_catalog.setval('public.producto_id_producto_seq', 10, true);
          public          postgres    false    221            �           0    0    resena_id_resena_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.resena_id_resena_seq', 11, true);
          public          postgres    false    239            �           0    0     tipo_noticia_id_tipo_noticia_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('public.tipo_noticia_id_tipo_noticia_seq', 3, true);
          public          postgres    false    223            �           2606    49913 "   cargo_empleado cargo_empleado_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.cargo_empleado
    ADD CONSTRAINT cargo_empleado_pkey PRIMARY KEY (id_cargo_empleado);
 L   ALTER TABLE ONLY public.cargo_empleado DROP CONSTRAINT cargo_empleado_pkey;
       public            postgres    false    210            �           2606    49945    categoria categoria_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria);
 B   ALTER TABLE ONLY public.categoria DROP CONSTRAINT categoria_pkey;
       public            postgres    false    218            �           2606    50000    cliente cliente_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT cliente_pkey PRIMARY KEY (id_cliente);
 >   ALTER TABLE ONLY public.cliente DROP CONSTRAINT cliente_pkey;
       public            postgres    false    232            �           2606    50014     detalle_orden detalle_orden_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.detalle_orden
    ADD CONSTRAINT detalle_orden_pkey PRIMARY KEY (id_detalle_orden);
 J   ALTER TABLE ONLY public.detalle_orden DROP CONSTRAINT detalle_orden_pkey;
       public            postgres    false    236            �           2606    49929    empleado empleado_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT empleado_pkey PRIMARY KEY (id_empleado);
 @   ALTER TABLE ONLY public.empleado DROP CONSTRAINT empleado_pkey;
       public            postgres    false    214            �           2606    49920 $   estado_empleado estado_empleado_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.estado_empleado
    ADD CONSTRAINT estado_empleado_pkey PRIMARY KEY (id_estado_empleado);
 N   ALTER TABLE ONLY public.estado_empleado DROP CONSTRAINT estado_empleado_pkey;
       public            postgres    false    212            �           2606    49975 "   estado_noticia estado_noticia_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public.estado_noticia
    ADD CONSTRAINT estado_noticia_pkey PRIMARY KEY (id_estado_noticia);
 L   ALTER TABLE ONLY public.estado_noticia DROP CONSTRAINT estado_noticia_pkey;
       public            postgres    false    226            �           2606    49991    estado_orden estado_orden_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.estado_orden
    ADD CONSTRAINT estado_orden_pkey PRIMARY KEY (id_estado_orden);
 H   ALTER TABLE ONLY public.estado_orden DROP CONSTRAINT estado_orden_pkey;
       public            postgres    false    230            �           2606    49936 $   estado_producto estado_producto_pkey 
   CONSTRAINT     r   ALTER TABLE ONLY public.estado_producto
    ADD CONSTRAINT estado_producto_pkey PRIMARY KEY (id_estado_producto);
 N   ALTER TABLE ONLY public.estado_producto DROP CONSTRAINT estado_producto_pkey;
       public            postgres    false    216            �           2606    50021     estado_resena estado_resena_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.estado_resena
    ADD CONSTRAINT estado_resena_pkey PRIMARY KEY (id_estado_resena);
 J   ALTER TABLE ONLY public.estado_resena DROP CONSTRAINT estado_resena_pkey;
       public            postgres    false    238            �           2606    49952    material material_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.material
    ADD CONSTRAINT material_pkey PRIMARY KEY (id_material);
 @   ALTER TABLE ONLY public.material DROP CONSTRAINT material_pkey;
       public            postgres    false    220            �           2606    49984    noticia noticia_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.noticia
    ADD CONSTRAINT noticia_pkey PRIMARY KEY (id_noticia);
 >   ALTER TABLE ONLY public.noticia DROP CONSTRAINT noticia_pkey;
       public            postgres    false    228            �           2606    50007    orden_compra orden_compra_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.orden_compra
    ADD CONSTRAINT orden_compra_pkey PRIMARY KEY (id_orden_compra);
 H   ALTER TABLE ONLY public.orden_compra DROP CONSTRAINT orden_compra_pkey;
       public            postgres    false    234            �           2606    49961    producto producto_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (id_producto);
 @   ALTER TABLE ONLY public.producto DROP CONSTRAINT producto_pkey;
       public            postgres    false    222            �           2606    50028    resena resena_pkey 
   CONSTRAINT     W   ALTER TABLE ONLY public.resena
    ADD CONSTRAINT resena_pkey PRIMARY KEY (id_resena);
 <   ALTER TABLE ONLY public.resena DROP CONSTRAINT resena_pkey;
       public            postgres    false    240            �           2606    49968    tipo_noticia tipo_noticia_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public.tipo_noticia
    ADD CONSTRAINT tipo_noticia_pkey PRIMARY KEY (id_tipo_noticia);
 H   ALTER TABLE ONLY public.tipo_noticia DROP CONSTRAINT tipo_noticia_pkey;
       public            postgres    false    224            �           2620    50112 "   producto agregar_bitacora_producto    TRIGGER     �   CREATE TRIGGER agregar_bitacora_producto AFTER INSERT ON public.producto FOR EACH ROW EXECUTE FUNCTION public.anadir_producto_bitacora();
 ;   DROP TRIGGER agregar_bitacora_producto ON public.producto;
       public          postgres    false    258    222            �           2620    50114 *   producto t_actualizar_bitacora_producto_p1    TRIGGER     �   CREATE TRIGGER t_actualizar_bitacora_producto_p1 AFTER UPDATE ON public.producto FOR EACH ROW EXECUTE FUNCTION public.actualizar_producto_bitacora_p1();
 C   DROP TRIGGER t_actualizar_bitacora_producto_p1 ON public.producto;
       public          postgres    false    222    259            �           2606    50045    detalle_orden fk_datalle_orden    FK CONSTRAINT     �   ALTER TABLE ONLY public.detalle_orden
    ADD CONSTRAINT fk_datalle_orden FOREIGN KEY (id_orden_compra) REFERENCES public.orden_compra(id_orden_compra);
 H   ALTER TABLE ONLY public.detalle_orden DROP CONSTRAINT fk_datalle_orden;
       public          postgres    false    234    3288    236            �           2606    50095    empleado fk_empleado_cargo    FK CONSTRAINT     �   ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT fk_empleado_cargo FOREIGN KEY (id_cargo_empleado) REFERENCES public.cargo_empleado(id_cargo_empleado);
 D   ALTER TABLE ONLY public.empleado DROP CONSTRAINT fk_empleado_cargo;
       public          postgres    false    3264    210    214            �           2606    50100    empleado fk_empleado_estado    FK CONSTRAINT     �   ALTER TABLE ONLY public.empleado
    ADD CONSTRAINT fk_empleado_estado FOREIGN KEY (id_estado_empleado) REFERENCES public.estado_empleado(id_estado_empleado);
 E   ALTER TABLE ONLY public.empleado DROP CONSTRAINT fk_empleado_estado;
       public          postgres    false    214    3266    212            �           2606    50060    noticia fk_noticia_estado    FK CONSTRAINT     �   ALTER TABLE ONLY public.noticia
    ADD CONSTRAINT fk_noticia_estado FOREIGN KEY (id_estado_noticia) REFERENCES public.estado_noticia(id_estado_noticia);
 C   ALTER TABLE ONLY public.noticia DROP CONSTRAINT fk_noticia_estado;
       public          postgres    false    228    3280    226            �           2606    50070    noticia fk_noticia_producto    FK CONSTRAINT     �   ALTER TABLE ONLY public.noticia
    ADD CONSTRAINT fk_noticia_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto);
 E   ALTER TABLE ONLY public.noticia DROP CONSTRAINT fk_noticia_producto;
       public          postgres    false    3276    228    222            �           2606    50030    orden_compra fk_orden_cliente    FK CONSTRAINT     �   ALTER TABLE ONLY public.orden_compra
    ADD CONSTRAINT fk_orden_cliente FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);
 G   ALTER TABLE ONLY public.orden_compra DROP CONSTRAINT fk_orden_cliente;
       public          postgres    false    3286    232    234            �           2606    50040    orden_compra fk_orden_empleado    FK CONSTRAINT     �   ALTER TABLE ONLY public.orden_compra
    ADD CONSTRAINT fk_orden_empleado FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado);
 H   ALTER TABLE ONLY public.orden_compra DROP CONSTRAINT fk_orden_empleado;
       public          postgres    false    3268    214    234            �           2606    50035    orden_compra fk_orden_estado    FK CONSTRAINT     �   ALTER TABLE ONLY public.orden_compra
    ADD CONSTRAINT fk_orden_estado FOREIGN KEY (id_estado_orden) REFERENCES public.estado_orden(id_estado_orden);
 F   ALTER TABLE ONLY public.orden_compra DROP CONSTRAINT fk_orden_estado;
       public          postgres    false    234    230    3284            �           2606    50085    producto fk_producto_categoria    FK CONSTRAINT     �   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria(id_categoria);
 H   ALTER TABLE ONLY public.producto DROP CONSTRAINT fk_producto_categoria;
       public          postgres    false    218    3272    222            �           2606    50090    producto fk_producto_empleado    FK CONSTRAINT     �   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_producto_empleado FOREIGN KEY (id_empleado) REFERENCES public.empleado(id_empleado);
 G   ALTER TABLE ONLY public.producto DROP CONSTRAINT fk_producto_empleado;
       public          postgres    false    222    214    3268            �           2606    50080    producto fk_producto_estado    FK CONSTRAINT     �   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_producto_estado FOREIGN KEY (id_estado_producto) REFERENCES public.estado_producto(id_estado_producto);
 E   ALTER TABLE ONLY public.producto DROP CONSTRAINT fk_producto_estado;
       public          postgres    false    222    216    3270            �           2606    50075    producto fk_producto_material    FK CONSTRAINT     �   ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_producto_material FOREIGN KEY (id_material) REFERENCES public.material(id_material);
 G   ALTER TABLE ONLY public.producto DROP CONSTRAINT fk_producto_material;
       public          postgres    false    222    220    3274            �           2606    50050    resena fk_resena_detaller    FK CONSTRAINT     �   ALTER TABLE ONLY public.resena
    ADD CONSTRAINT fk_resena_detaller FOREIGN KEY (id_detalle_orden) REFERENCES public.detalle_orden(id_detalle_orden);
 C   ALTER TABLE ONLY public.resena DROP CONSTRAINT fk_resena_detaller;
       public          postgres    false    236    240    3290            �           2606    50055    resena fk_resena_estado    FK CONSTRAINT     �   ALTER TABLE ONLY public.resena
    ADD CONSTRAINT fk_resena_estado FOREIGN KEY (id_estado_resena) REFERENCES public.estado_resena(id_estado_resena);
 A   ALTER TABLE ONLY public.resena DROP CONSTRAINT fk_resena_estado;
       public          postgres    false    3292    238    240            �           2606    50065    noticia fk_tipo_noticia    FK CONSTRAINT     �   ALTER TABLE ONLY public.noticia
    ADD CONSTRAINT fk_tipo_noticia FOREIGN KEY (id_tipo_noticia) REFERENCES public.tipo_noticia(id_tipo_noticia);
 A   ALTER TABLE ONLY public.noticia DROP CONSTRAINT fk_tipo_noticia;
       public          postgres    false    228    224    3278            |   I   x�3�tL����,.)JL�/�2�J-H,*�q�9��SR�KS��L8�S�R�JR�L9�KR��2��Jb���� $�      �   I   x�3�tJ,I-:�6��3371=5�ˈ3�$5�83'3.f��_����Y���_�
6�tN,��L ����� n(X      �   D  x����n�6����8�n%C�DY��7mc�i�����УȀ���o������v�������r�I��t����2&_����jP�Qe6�E��l�`��F�kZ���:���tx�j����n�F�f�$H��=��I��=��}r�>�z�P�X;Z�X�IZA�B�
k�h`�V�Ԫ�#�S悧�=�뷈��G�,�i����I���_�$o�ź����ٝd�_k��-E��"���jk�e/�ma��l!��:�&����*���L�!GPY����ʨ������q��d�8�IV�ӣ��M�\���e7����c�>M�OKZ�h�-��N�(��L|����Z|3
�S]_��wC�G��|rFK����/�~'tA�9��W��-�iL��x�x�Zo���>�wM��ʾ��[��P�4�>�d�����L�	����x!ln� �}�G����_>��EV0~��}�^8(�@0��.�����9m:�߱
6�I*�Ը�~<���i8�
=����M-���$y��6�����Dr�Km��:
�y6~�)����G�1��F�Y��U�oȾ�i|gk�s{�7EX���u�m8��O��Pm'�Qҏ��,�{�SS�C���=+9_t��><�F�
h$�s�{��d�I5�Zi��?�>;�qu���������5�I����^RA�%����fq�c.����	�i�a)5[��v��L�71��)s�q�e�	�W�k	t���C���|.�T��}�G�S�������P%^�=��E��5Bn9:$���[���U���$ND�L�'o�d�������Y)�+      �   �   x�U�K!C��0�@��.s�sL��g��������b�7L� ��.�*��
Q1��W5�<{�FC����8�Gs�,�6��!j��D��:'o���V#����obHO���'�(#2w@�����"6�<���8DMܙ;̎�����KZ{z��9ؚ`ʀ��I���#��w�	[�v�	�Gf�p��%Z�|&�ç �E�E�      �   p  x�mS���0=O�����ı��l���V]���R5���'']H��#�=�	�1�q�[�U�J}�yo��8�B�\��L5��Åǽ#X*�
	n@W:�g���������1�.���5��)�H��D?���H���n�+��o=�BTB6��p�'Rol�����ˆ\�*���T!�Jx��S~#���dE
.y�F��z�����0��11��yT�Ȇ�BI�5�%|�X��x���C4'Ԁ���I�NdB��=Z��YL����<U<j���Sc���JpXl�/{X�ʛ�N�c�$g����	秓��ԝ�U��wm��=�nF�ıx�P�Ӝ
��0�Ko���=��dx�	��c����T�6�q-�����%�Ev$�E�z|�^�DQ���������g��j�i�ϬbPn�cs�ZX�<,�P�j���^�����	i 	��l�@r�F���6�5����a������q ��*r)2��T��eP���ß��=r�mI�S�uت�Ui��'Wp���X<�䱬dܫx�����g@���.�58R1�2��|�����f�Ý'Η�A[�;���c��~Ex�!��s~/h���o3F�#�v���Teth��t2��9tV�      ~   5   x�3�tL.�,��2�.-.H�K�L��2�tIr�lNל��̼D ;F��� �
f      �   "   x�3�tL.�,KLI�2�t��K�ɬqb���� �IB      �   "   x�3�tL.�,��2�t�����KL������ gS*      �   1   x�3�t�SH��,.I�K�L,�2�tL�/IL��2�t������c���� ;:<      �   "   x�3�tL.�,K�2�t�����KLI����� e�      �   f   x�3��MLI-J�2���L-*��2�tLN-�W��˯�LIL�I�2��)���d��s�B�p�q�^X\����eST�P �@B���04��!���� f5�      �   �  x�uS�n�0������B����X#@�N���L�#���o<f,�Տ�(Y�4�O�{��^��Z��5�� �[����R�ԩ���$t8��p �} e<�� �|�Q^�J�EU/d�~h�������B�'�Z�tʇ����6k��gB󾧄-��g��?3TE-6��ؙ_�}@����x*>���[� ��2�J|ǐ��z�B�hbʾ�����8Tľ�ο��	�ϖ��/Y:��>��m�q.�ܪߘ��$?<NU4b�m� ��h��s��q���ѕ#��	~�X��_�Iq'���Y'�D��ε�63ep��Oq��U^�.E#��^lF78>�{^��ȩ2[U�����gfF�ۄL�6a�C�g�ĮE�l\�l��\��ד�	Y|�n۳���1eۦ�9��zs�9�x���$B�nx�+����M����a	F_����M�(������.7k���������l����������      �   �  x����n�0���S��5Y�v��r[�T,ꖪ�r�uF��׃�d�>�o@_���n q�(�lE���c�����HG��E��q�t�uY5eUC�^W��Lɧs�m�spoF
��Z�`
8wx�=l(����%:���\���G��q����Fٽs��E���C�(t�����@�O�8����:�K�fu�����\D���g�%���y'�{YzOp9Y�� �/@�S���o�B�/�)A��	�T�*{�چ�>K�$��]��~�5�=�v[$�ڬ�$U�~��J$�y�]c���9v��}�;��ȶ+1��8P��Z��\��ޢ��T�-�3u�d�E53�Ma8{a�*M53τ��zahSʑߠ&ק��q���G��E�K�O!h�_���a/��i����F��m��|28;bq�0��
�V�%�;i�����fV'�y��_�B�      �   [  x�m�1r�0E�S���5�2M�2��D33�Nʔ9�/��x�dhv�گ��&N����]N�5Go!d�o���� UVh�p�y�=4�8����DÛ'��Ф6= v�|�(�B=7�� ��]���l�K���АU�ʛDA%+Po�yg'�QBnG[���Kg��~O.2r��x&�tu5ri�@gZKA��Ǆ\i���7y�q�6�yVj�m3�D��Sw�ɗ���LK�?��k�Lg�?��s�T@ݑLJ����,#*z��,�=/x��$2&�A*��GmǉR���!�=9�,)&rl�WY��n�Rr?w�w	i�{�,��[��pL�R      �   J  x����N�0�g�)��-�l�!iw�J3���(�S��xF��y1�V�-"L���w�������&�`=4��_���h�4Af�P�M#���-)�`B,X��w��5+׌N8��N�*43���c�|թ�95AO����9�G>c��`4��I��T��g�4:k�UY��%�|�L���ͼ���%���]Dc=t2�ӲE���#J�h�*AF#��$�^��`�r�dM������&SB����w"�g�r�����DP��&-Ȕ�1%��Mߕ5c@�b��0I^�T]M�Q��6���|IFΫ)����~�)�K��[�`�1��~�_�D      �   1   x�3�(���O�<�9�ˈ�'1�*1735�$�˘�)1//��+F��� ,�     