const resourceBoxWidth = 250;
const resourceBoxHeight = 90;
const halfBoxWidth = resourceBoxWidth / 2;
const halfBoxHeight = resourceBoxHeight / 2;
const urlLeftMargin = 10;
const urlFontSize = 18;
const fullPathFontSize = 8;

/* Method to translate the rectangle selection for API Types */
export const setRectTranslation = (childCount) => {
  var translateValue;
  if(childCount === 1) {
    translateValue = 10;
  } else if(childCount === 3) {
    translateValue = 50;
  } else if(childCount === 5) {
    translateValue = 90;
  } else if(childCount === 7) {
    translateValue = 130;
  } else if(childCount === 9) {
    translateValue = 172;
  }
  return translateValue;
};

/* Method to translate the text selection for API Types */
export const setTextTranslation = (childCount) => {
  var translateValue;
  if(childCount === 2) {
    translateValue = 15;
  } else if(childCount === 4) {
    translateValue = 55;
  } else if(childCount === 6) {
    translateValue = 95;
  } else if(childCount === 8) {
    translateValue = 135;
  } else if(childCount === 10) {
    translateValue = 177;
  }
  return translateValue;
};

export default class {
  static resourceBoxWidth() { return resourceBoxWidth; }
  static resourceBoxHeight() { return resourceBoxHeight; }
  static halfBoxHeight() { return halfBoxHeight; }
  static halfBoxWidth() { return halfBoxWidth; }
  static drawNodes(g, rootTreeNode, handler) {

    // Create a new <g> for every object in the nodeList
    let node = g.selectAll(".node")
      .data(rootTreeNode.descendants(), function(d) {
        // Use the ID as the d3 identifier so that nodes can be replaced by ID
        return d.data.id;
      })
      .enter().append("g")
      .attr("class", function(d) { return "node" +
          (d.children ? " node--internal" : " node--leaf"); })
      .attr("id", function(d) { return d.data.id })
      .attr("transform", function(d) {
        return "translate(" + d.y + "," + d.x + ")"; 
      });

    // inbound connector
    node.append("circle")
      .attr("class", "connector-in")
      .attr("r", "5")
      .attr("transform", function(d) {
        return "translate(0,45)";
      });

    // CRUD Node
    node.append("rect")
      .attr("width", resourceBoxWidth)
      .attr("height", resourceBoxHeight)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("class", function(d) {
        if(d.data.active) {
          return "node-uri-activated"
        } else {
          return "node-uri"
        }
      })
      .on("click", function(d) {
        handler({
          name: "detail",
          source: d.data
        })
      });

    // CRUD Node URI (not the full path)
    node.append("text")
      .filter(function(d) {
        return !d.data.rootNode
       })
      .attr("font-size", urlFontSize)
      .attr("transform", function(d) {
        return "translate(" + urlLeftMargin + "," + ((resourceBoxHeight / 2)+ urlFontSize/2) + ")"
      })
      .text(function(d) { return d.data.url; })
      .style("pointer-events",  "none");
    node.append("text")
      .filter(function(d) {
        return d.data.rootNode
       })
      .attr("font-size", urlFontSize)
      .attr("transform", function(d) {
        return "translate(" + urlLeftMargin + "," + ((resourceBoxHeight / 2)+ urlFontSize/2) + ")"
      })
      .text(function(d) { return d.data.name; })
      .style("pointer-events",  "none");

    // top separator
    node.append("path")
      .filter(function(d) {
        return !d.data.rootNode
       })
      .attr("class", "node-internal-border")
      .attr("d", function(d) {
          return "M0,20," + resourceBoxWidth + ",20"
      });

    // bottom separator
    node.append("path")
      .attr("class", "node-internal-border")
      .attr("d", function(d) {
          return "M0," + (resourceBoxHeight - 20) + "," + resourceBoxWidth + "," + (resourceBoxHeight - 20);
    });

    // outbound node
    node.append("circle")
      .attr("r", "15")
      .attr("class", function(d){
        if(!d.data.rootNode) {
          // TODO - child node changes 
          //if(d.data.url.length>1 && d.data.apiList.length>1) {
          //  return "connector-out"
          //} else {
          //  return "connector-out-disabled"
          //}
          return "connector-out"
        } else {
          return "connector-out"
        }
      })
      .attr("transform", function() {
        return "translate(" + resourceBoxWidth + "," + resourceBoxHeight / 2 +")";
      })
      .on("click", function(d) {
        handler({
          name: "add",
          source: d
        })
      });

    node.append("text")
      .attr("font-size", "18")
      .text("+")
      .attr("transform", function() {
        return "translate(" + (resourceBoxWidth - 5) + "," + (resourceBoxHeight / 2  + 5)+ ")";
      })
      .style("pointer-events",  "none");

    // Full URI path
    node.append("text")
      .attr("font-size", fullPathFontSize)
      .text(function(d) {
        if(d.data.rootNode) {
          return d.data.rootPath;
        }else {
          while (d.parent) {
            if(d.parent.data.rootNode) {
              handler({
                name: "updatePath",
                source: d.data,
                path: d.parent.data.rootPath + d.data.url
              })
              return d.data.fullPath = d.parent.data.rootPath + d.data.url
            } else {
              handler({
                name: "updatePath",
                source: d.data,
                path: d.parent.data.fullPath + d.data.url
              })
              return d.data.fullPath = d.parent.data.fullPath + d.data.url
            }
          }
        }
        
      })
      .attr("transform", "translate(10," + (resourceBoxHeight-7) + ")")
      .style("pointer-events",  "none")


    // Method badges
    let badges = node.append("g").attr("class", "badges");

    let getType = 
      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var getValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'GET') {
                getValue = true;
                return getValue;
              }
            })
            return getValue;
          }
        })
        .append("rect")
        .attr("width", 33)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", function(d){
          var translateX = setRectTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",5)";
        })
        .attr("class", "get");

      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var getValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'GET') {
                getValue = true;
                return getValue;
              }
            })
            return getValue;
          }
         })
        .append("text")
        .attr("font-size", fullPathFontSize)
        .text(function(d) {
          return "GET";
        })
        .attr("width", 20)
        .attr("height", 8)
        .attr("transform", function(d){
          var translateX = setTextTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",14)";
        });

    let putType = 
      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var putValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PUT') {
                putValue = true;
                return putValue;
              }
            })
            return putValue;
          }
        })
        .append("rect")
        .attr("width", 33)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", function(d){
          var translateX = setRectTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",5)";
        })
        .attr("class", "put");

      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var putValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PUT') {
                putValue = true;
                return putValue;
              }
            })
            return putValue;
          }
        })
        .append("text")
        .attr("font-size", fullPathFontSize)
        .text(function(d) {
          return "PUT";
        })
        .attr("width", 20)
        .attr("height", 8)
        .attr("transform", function(d){
          var translateX = setTextTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",14)";
        });

    let postType = 
      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var postValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'POST') {
                postValue = true;
                return postValue;
              }
            })
            return postValue;
          }
        })
        .append("rect")
        .attr("width", 33)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", function(d){
          var translateX = setRectTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",5)";
        })
        .attr("class", "post");

      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var postValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'POST') {
                postValue = true;
                return postValue;
              }
            })
            return postValue;
          }
        })
        .append("text")
        .attr("font-size", fullPathFontSize)
        .text(function(d) {
          return "POST";
        })
        .attr("width", 22)
        .attr("height", 8)
        .attr("transform", function(d){
          var translateX = setTextTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",14)";
        });

    let patchType = 
      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var patchValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PATCH') {
                patchValue = true;
                return patchValue;
              }
            })
            return patchValue;
          }
        })
        .append("rect")
        .attr("width", 36)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", function(d){
          var translateX = setRectTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",5)";
        })
        .attr("class", "patch");

      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var patchValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'PATCH') {
                patchValue = true;
                return patchValue;
              }
            })
            return patchValue;
          }
        })
        .append("text")
        .attr("font-size", fullPathFontSize)
        .text(function(d) {
          return "PATCH";
        })
        .attr("width", 22)
        .attr("height", 8)
        .attr("transform", function(d){
          var translateX = setTextTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",14)";
        });

    let deleteType = 
      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var delValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'DELETE') {
                delValue = true;
                return delValue;
              }
            })
            return delValue;
          }
        })
        .append("rect")
        .attr("width", 43)
        .attr("height", 12)
        .attr("rx", 3)
        .attr("ry", 2)
        .attr("transform", function(d){
          var translateX = setRectTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",5)";
        })
        .attr("class", "delete");

      badges
        .filter(function(d) {
          if(d.data.apiList) {
            var delValue;
            d.data.apiList.forEach((item, index) => {
              if (item.apiType == 'DELETE') {
                delValue = true;
                return delValue;
              }
            })
            return delValue;
          }
        })
        .append("text")
        .attr("font-size", fullPathFontSize)
        .text(function(d) {
          return "DELETE";
        })
        .attr("width", 30)
        .attr("height", 8)
        .attr("transform", function(d){
          var translateX = setTextTranslation(this.parentElement.childElementCount);
          return "translate("+ translateX+ ",14)";
        });

    let closeIcon = badges
      .filter(function(d) {
        return !d.data.rootNode;
       })
      .append("rect")
      .attr("width", 20)
      .attr("height", 12)
      .attr("rx", 3)
      .attr("ry", 2)
      .attr("transform", "translate(220,5)")
      .style("cursor","pointer")
      .on("click", function(d) {
        handler({
          name: "delete",
          source: d
        })
      });

    badges.append("text")
      .filter(function(d) {
        return !d.data.rootNode
       })
      .attr("font-size", fullPathFontSize)
      .text(function(d) {
        return "X";
      })
      .attr("width", 20)
      .attr("height", 8)
      .attr("transform", "translate(228,14)")
      .style("cursor","pointer")
      .on("click", function(d) {
        handler({
          name: "delete",
          source: d
        })
      })

    return node;
  }
}