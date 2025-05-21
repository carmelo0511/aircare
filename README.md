# 🌍 AirCare – Surveillance de la qualité de l'air en temps réel

**AirCare** est une application cloud serverless qui affiche en temps réel l'indice de qualité de l'air (AQI) basé sur la géolocalisation de l'utilisateur. Le projet est conçu pour mettre en pratique les services cloud d'AWS dans un contexte réel, tout en étant simple, utile, et facilement déployable.

🔗 **Lien public** : [https://d385ybljdjmh2o.cloudfront.net](https://d385ybljdjmh2o.cloudfront.net)

---

## 🧱 Fonctionnalités principales

* Récupération automatique de la position GPS de l’utilisateur
* Appel backend sécurisé (AWS API Gateway + Lambda) avec la latitude/longitude
* Récupération des données de qualité de l’air via OpenWeatherMap API
* Affichage clair de l’indice AQI, PM2.5 et PM10
* Déploiement frontend en HTTPS via AWS S3 + CloudFront

---

## 🖼️ Architecture Cloud

```plaintext
[Utilisateur] ⇄ [CloudFront HTTPS] ⇄ [S3 Static Website Hosting]
                              ⇓
                         [API Gateway HTTP POST /air]
                              ⇓
                         [AWS Lambda (Node.js)]
                              ⇓
               [OpenWeatherMap Air Quality API (REST)]
```

---

## 🧰 Technologies & Services AWS utilisés

| Composant          | Détail                                    |
| ------------------ | ----------------------------------------- |
| Frontend           | HTML / CSS / JS                           |
| Backend            | AWS Lambda (Node.js + Axios)              |
| API Gateway        | HTTP API, méthode POST, CORS activé       |
| OpenWeatherMap API | Données AQI (clé stockée en variable env) |
| Hébergement        | S3 (public, static website)               |
| CDN + HTTPS        | AWS CloudFront avec redirection HTTPS     |

---

## 🔒 Sécurité & bonnes pratiques

* ✅ Clé API **non exposée côté frontend** (stockée dans Lambda → process.env)
* ✅ CORS configuré pour éviter les erreurs navigateur
* ⚠️ Pour aller plus loin : utiliser un rôle IAM dédié + secrets manager

---

## 🚀 Instructions de déploiement simplifié

1. Créer un bucket S3 avec public access et static hosting
2. Uploader `index.html`, `style.css`, `script.js`
3. Créer une fonction Lambda en Node.js avec Axios
4. Lier Lambda à API Gateway (HTTP POST, route `/air`)
5. Ajouter une variable d’environnement : `OPENWEATHER_API_KEY`
6. Activer CORS sur API Gateway
7. Créer une distribution CloudFront pointant sur S3
8. Forcer HTTPS, définir `index.html` comme racine

---

## ✅ Améliorations futures (Roadmap Cloud)

* [ ] Ajouter CloudWatch Logs & Monitoring détaillé (latence, erreurs)
* [ ] Enregistrer les requêtes AQI dans DynamoDB (log utilisateur)
* [ ] Ajouter des alertes via SNS (ex: AQI > 4)
* [ ] Support multi-langues (fr/en)
* [ ] Nom de domaine personnalisé (Route 53 + certificat ACM)

---

## 📂 Auteur

Bryan Nakache
Développeur Cloud Junior | Toronto 🇨🇦
Projet personnel pour démontrer des compétences AWS (serverless, sécurité, déploiement)

---