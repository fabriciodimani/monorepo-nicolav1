# Sincronización de ramas remotas

Si después de ejecutar `git fetch` tu rama local sigue mostrándose "atrasada" respecto a la remota, significa que aún no has incorporado los commits remotos en tu rama local. Para sincronizarla puedes usar alguno de los siguientes comandos:

1. **Actualizar la rama con `git pull`:**
   ```bash
   git pull
   ```
   `git pull` equivale a hacer `git fetch` seguido de `git merge` de la rama remota en tu rama local. Si no tienes cambios locales sin commitear, el merge será un *fast-forward* que solo moverá tu puntero local.

2. **Hacer fast-forward manual con `git merge --ff-only`:**
   ```bash
   git fetch
   git merge --ff-only origin/<nombre-de-la-rama>
   ```
   Esto trae los cambios del remoto y luego actualiza tu rama local únicamente si es posible avanzar sin crear un commit de merge.

3. **Reset suave cuando quieres descartar cambios locales:**
   ```bash
   git fetch
   git reset --hard origin/<nombre-de-la-rama>
   ```
   Úsalo solo si estás seguro de que no necesitas conservar cambios locales; alinea tu rama exactamente con la remota.

En el mensaje que ves:

```
Your branch is behind 'origin/codex/fix-date-format-for-payment-records' by 2 commits, and can be fast-forwarded.
```

Git te está indicando que la solución más simple es ejecutar `git pull` para mover tu rama local y quedar al día con la rama remota.
