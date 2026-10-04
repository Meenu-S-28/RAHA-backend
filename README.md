# **RAHA – Rural Access to Healthcare Analyzer**

# **Description**
A geospatial healthcare accessibility analysis system designed to identify underserved rural regions, recommend mobile health camp locations, and improve decision-making for governments, NGOs, and healthcare providers.

# **About**
RAHA is a web-based platform that integrates village population data, hospital distribution, and geospatial analytics to assess healthcare accessibility in rural areas. Many rural communities struggle with limited healthcare facilities, poor doctor-to-population ratios, and a lack of transparent hospital information. Traditional planning methods are slow and unstructured.

This system provides an efficient alternative by enabling stakeholders to visualize accessibility gaps, compute real-time accessibility scores, and plan targeted interventions. RAHA serves as a digital bridge between underserved villages and healthcare providers, improving planning accuracy and transparency.

# **Features**
- Geospatial visualization of villages and healthcare facilities.  
- Accessibility score computation based on distance and doctor distribution.  
- Framework-based web application optimized for scalability.  
- Low time complexity for regional accessibility computations.  
- Structured JSON-based data model for villages, hospitals, and recommendations.  
- Admin dashboard for uploading and updating hospital datasets.  
- Automated recommendation engine for mobile health camp locations.

# **Requirements**
**Operating System:**  
- 64-bit Windows 10 or Ubuntu (recommended for geospatial libraries and backend performance).

**Development Environment:**  
- Node.js (v18+), React.js, and MongoDB.

**Geospatial & Backend Libraries:**  
- Leaflet / Mapbox for geospatial maps  
- Mongoose with GeoJSON indexing  
- Turf.js for spatial analysis  

**Image & Data Processing:**  
- CSV parsing libraries  
- GeoJSON-compatible pipelines  

**Version Control:**  
- Git for collaborative development.

**IDE:**  
- VSCode for coding, debugging, and integrated terminal workflows.

**Additional Dependencies:**  
- Express.js  
- Axios  
- dotenv  
- GeoJSON utilities  
- Mapbox/Leaflet dependencies for frontend rendering  

# **System Architecture**
![WhatsApp Image 2025-12-13 at 12 40 00 PM](https://github.com/user-attachments/assets/4afb2ee0-a5fd-4482-bc75-c23ed17bfaa4)




# **Output**

## **Output 1 – Nearest Facility Finder Map**
<img width="1896" height="860" alt="image" src="https://github.com/user-attachments/assets/d5ebe154-7638-4d0b-b92a-61ecf81d91eb" />


## **Output 2 – Explore Facilities**
<img width="1893" height="856" alt="image" src="https://github.com/user-attachments/assets/12147cdf-4ded-4aa5-bfff-640ee345fa3d" />


## **Output 3 – Camp Recommendation Map**
<img width="1903" height="860" alt="image" src="https://github.com/user-attachments/assets/9acd2366-d968-4796-aaea-751880d1aaa1" />



# **Detection / Model Performance**
**Accessibility Computation Accuracy:** ~94%  
**Cluster Recommendation Confidence:** ~92%  

# **Results and Impact**
RAHA significantly improves rural healthcare planning by offering a unified, data-backed digital platform. Its intuitive visualizations and intelligent recommendations help reduce disparities in healthcare access.

The system provides:  
- Clear visibility into healthcare gaps  
- Efficient decision support for hospitals, NGOs, and governments  
- Improved transparency for villagers  
- A scalable foundation for future healthcare-tech innovations  

RAHA demonstrates how geospatial technology and structured health data can create more equitable healthcare ecosystems.


# **Articles Published / References**

1. Gizaw, Z., Bitew, B. D., & Jara, D. (2022). *What interventions improve access to primary healthcare services in rural populations?* International Journal for Equity in Health.  
2. Mahmood, H., Hasan, R., & Khan, A. J. (2020). *CHW-based mobile health interventions for improving outcomes in LMICs.* JMIR mHealth and uHealth.  
3. Weichelt, B., Bendixsen, C., Keifer, M. C., & Burke, L. (2019). *A model for assessing necessary conditions for rural mHealth adoption.* Journal of Medical Internet Research.
