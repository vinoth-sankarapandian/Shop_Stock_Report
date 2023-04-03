$(document).ready(async function () {
  var creatorSdkPromise = ZOHO.CREATOR.init();
  // @autor - Vinoth S ( vinothelysian@gmail.com / vinothsankarapandian@gmail.com )
  //get url parameter
  // const _url = "?" + parent.document.URL.split("?")[1];
  // const urlParams = new URLSearchParams(_url);
  // console.log(urlParams, "obj");
  // console.log(_url, "url");
  // const Category = urlParams("Category").slice(",");
  // const Sub_Category = urlParams("Sub_Category").slice(",");
  // const Tag = urlParams("Tag").slice(",");
  // const Selection = urlParams("Selection").slice(",");
  // const Collection = urlParams("Collection").slice(",");
  // const Brand = urlParams("Brand").slice(",");
  // const _ID = urlParams("ID");/
  //

  const APP_NAME = "catalog";
  var page = 1;
  var pageSize = 100;

  creatorSdkPromise
    .then(async (data) => {
      //sdk init success block start

      console.log("Success");
      var queryParams = ZOHO.CREATOR.UTIL.getQueryParams();
      //const _ID = queryParams.ID;
      //console.log( _ID);

      //prepare criteria
      var _id_string = queryParams?.ID ?? "";
      //console.log(_id_string);
      var _id_list = _id_string.split(",");
      console.log(_id_list, "ID list");
      _criteria = "";
      if (_id_list.length > 0 && _id_list[0] != "") {
        _id_list.forEach((_id) => {
          _criteria += " || " + "ID == " + _id;
        });

        _criteria = _criteria.replace("||", "");
      }

      console.log(_criteria);
      //fetch all records
      fetch_record = async () => {
        //configuration json
        config = {
          appName: `${APP_NAME}`,
          reportName: "All_Product_Images",
          criteria: _criteria,
          page: `${page}`,
          pageSize: `${pageSize}`,
        };

        //get all records API
        ZOHO.CREATOR.API.getAllRecords(config).then((r) => {
          var image_gallery = document.querySelector(".image-gallery");
          console.log(r);
          if (r.code == "3000") {
            r.data.forEach((rec) => {
              image_gallery.insertAdjacentHTML(
                "beforeend",
                `<div imageId="${rec.ID}" productId="${rec.Product.ID} id="${
                  rec.ID
                }" class="product-image">  
                  <div class="product-head"> <div class="name">${
                    rec["Product.Product_Name"] ?? "-"
                  } </div> <div class="price"> ${
                  rec["Product.Price"] ?? "-"
                } INR </div>  </div>
                    <div class="image-container"> 
                      <img productName='${
                        rec["Product.Product_Name"] ?? "-"
                      }' price="${rec["Product.Price"] ?? "0.00"}"  src=${
                  rec.Image
                } /> 
                    </div>
  <div class="icon-container" > 
  i </div>
                    <div class="product-details">
  
                      <table>
                        <tr> 
                          <td> ${rec["Product.Product_Name"] ?? "-"} </td>  
                        </tr>
                        <tr> 
                          <td> ${rec["Product.Category"] ?? "-"} </td> 
                         </tr>
                        <tr> 
                           <td> ${rec["Product.Sub_Category"] ?? "-"} </td> 
                         </tr>
                         <tr> 
                          <td> ${rec["Product.Price"] ?? "-"} INR </td> 
                         </tr>
                         <tr> 
                         <td> ${rec["Product.Brand"] ?? "-"} </td> 
                         </tr>
                      </table>
  
                    </div>
  
                    <input class="image-checkbox" form="catalog_image" id="${
                      rec.ID
                    }" value="${rec.ID}"  type="checkbox" />
  
                  </div>`
              );
              //set onclick action

              document
                .querySelectorAll(".product-image")
                .forEach((_element) => {
                  _element.onclick = (e) => {
                    selectProduct(e);
                  };
                });
            });
            //increment page
            page += 1;
            showLoadMoreButton();
          } else {
            console.log("error");
          }
        });
      };
      hideLoadMoreButton();
      try {
        if (_id_list.length > 0) {
          fetch_record();
        } else {
          console.log("No Record Selected");
        }
      } catch (e) {
        console.log("Error", e);
      }

      document.querySelector("#load_more").onclick = () => {
        //page += 1;
        fetch_record();
      };

      function hideLoadMoreButton() {
        document.querySelector("#load_more").style.display = "none";
      }

      function showLoadMoreButton() {
        document.querySelector("#load_more").style.display = "block";
      }

      function displayFullImage(e) {
        var _view_button = e.target;
        console.log(_view_button);
        _view_button = e.target.closest(".product-image");
        console.log(_view_button);
        var url = _view_button.querySelector("img").src;
        console.log(url);
        var _image_element = _view_button.querySelector("img");
        var _productName = _image_element.getAttribute("productName") ?? "-";
        var _price = _image_element.getAttribute("price") ?? "-";

        var _popup_image_container = document.querySelector(
          "#popup_image_container"
        );
        var _popup_image_container = document.querySelector(
          "#popup_image_container"
        );

        console.log(_popup_image_container);
        _popup_image_container.querySelector("img").src = url;
        document.querySelector(
          "#v_product_details_container"
        ).innerHTML = `${_productName} <br> ${_price}`;
        _popup_image_container.style.display = "flex";
      }

      function closePopUpScreen() {
        var _popup_image_container = document.querySelector(
          "#popup_image_container"
        );
        _popup_image_container.style.display = "none";
      }
      //
      document.querySelector("#popup_close_button").onclick = () => {
        closePopUpScreen();
      };

      function selectProduct(e) {
        isIcon = e.target.classList.contains("icon-container");
        if (isIcon == true) {
          displayFullImage(e);
        } else {
          _checkbox = e.target
            .closest(".product-image")
            .querySelector(".image-checkbox");
          _checkbox.checked = !_checkbox.checked;

          var idList = "";
          var count = 0;
          document
            .querySelectorAll(".image-checkbox:checked")
            .forEach((_el) => {
              idList += _el.id + ",";
              count += 1;
            });
          //set selected image count
          document.querySelector("#create_catalog").innerHTML =
            "Create Catalog (" + count + ")";

          //set url
          document.querySelector("#create_catalog").href =
            "https://creatorapp.zoho.in/shivshaktitextiles/catalog#Form:Catalog?zc_LoadIn=dialog&Selected_Products=" +
            idList;
        }
      }

      //sdk init success block end
    })
    .catch((_error) => {
      //sdk init error block start
      console.log("Error", _error);
      //sdk init error block start
    });
});
