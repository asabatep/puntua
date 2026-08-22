# Calculadora castellera (puntua.cat)

Una calculadora senzilla d'actuacions castelleres, segons les taules en vigor o històriques, feta amb HTML i React 18.

Visiteu-la a https://puntua.cat

## Desplegament local

Com que el JSX es carrega amb `fetch`, cal servir els fitxers per HTTP (obrir `index.html` directament amb `file://` no funciona). Per exemple:

```
python3 -m http.server
```

I després obrir `http://localhost:8000`.
