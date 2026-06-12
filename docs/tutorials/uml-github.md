This is a quick repo link on how to setup UML links in your repo. It enables the images to be hosted via plantUML and you save the UML markdown in your repo. This makes saving and keeping your UML diagrams up to date without needing any plugins. 

Example tested from [THIS](https://stackoverflow.com/questions/32203610/how-to-integrate-uml-diagrams-into-gitlab-or-github) stack Exchange thread. 

1. Make a diagram.

Go to [This Site](https://editor.plantuml.com) and make your diagram. Use the main page for references: https://plantuml.com/class-diagram

2. Save the diagram in Github. 
The extension needs to be .puml (Plant UML)
Open the link as RAW and copy the URL:
https://github.com/macclab-stevens/Tutorials/blob/main/bladeRF_Ue_Setup.puml

3. Open a new plantuml editor:
And add this ONE LINE to the editor: [https://www.plantuml.com/plantuml/uml/](https://www.plantuml.com/plantuml/uml/)
!includeurl THE-RAW-URL-OF-YOUR-UML-FROM-GITHUB
e.g. !includeurl https://raw.githubusercontent.com/macclab-stevens/Tutorials/refs/heads/main/bladeRF_Ue_Setup.puml
Make sure the right UML is loaded! If you run into issues check the previous steps

4. Copy the link at the bottom of the image loader:
//www.plantuml.com/plantuml/png/1S793K8n30N0Lg00uZi5K03B-Sj97YIIiyWBjC_CkSyYKH4gf-Q-xKga_4kVxYro6BIiwPYUoXeqk1JXV3775zFe6RwqinWftaODN8q6zqbPkE9-Eruu7l3OQSUGFm00

This is the link we put into our markdown on GitHub! 

`![Plant UML Model](http://www.plantuml.com/plantuml/png/1S793K8n30N0Lg00uZi5K03B-Sj97YIIiyWBjC_CkSyYKH4gf-Q-xKga_4kVxYro6BIiwPYUoXeqk1JXV3775zFe6RwqinWftaODN8q6zqbPkE9-Eruu7l3OQSUGFm00)` 

Note: I had to put an "http:" in front of the copied UML link.

![Plant UML Model](http://www.plantuml.com/plantuml/png/1S793K8n30N0Lg00uZi5K03B-Sj97YIIiyWBjC_CkSyYKH4gf-Q-xKga_4kVxYro6BIiwPYUoXeqk1JXV3775zFe6RwqinWftaODN8q6zqbPkE9-Eruu7l3OQSUGFm00)
 

For the workflow now you can edit your UML in another edit, and when you link the image in the plant UML editor you can just update the .puml file in your repo and it will update! 