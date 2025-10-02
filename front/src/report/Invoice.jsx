import React from "react";
import easyinvoice from "easyinvoice";
import "../css/invoice.css";

class EasyInvoiceSample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      invoiceBase64: "",
    };
  }

  async createInvoice() {
    //See documentation for all data properties
    const data = this.getSampleData();
    const result = await easyinvoice.createInvoice(data);
    this.setState({
      invoiceBase64: result.pdf,
    });
  }
  async downloadInvoice() {
    //See documentation for all data properties
    const data = this.getSampleData();
    const result = await easyinvoice.createInvoice(data);
    easyinvoice.download("Comanda Nro "+this.props.datacomanda[0].nrodecomanda+".pdf", result.pdf);
  }
  async renderInvoice() {
    //See documentation for all data properties
    document.getElementById("pdf").innerHTML = "loading...";
    const data = this.getSampleData();
    const result = await easyinvoice.createInvoice(data);
    easyinvoice.render("pdf", result.pdf);
  }
  render() {
    return (
      <div class="container mb-1">
        <div className="invoice">
          <button
            className="fa fa-print"
            aria-hidden="true"
            onClick={() => this.downloadInvoice()}
          ></button>
          <div id="pdf"></div>
        </div>
      </div>
    );
  }

  getSampleData() {
    let temp = new Date(this.props.datacomanda[0].fecha);
    let fecha = temp.toLocaleString("es-AR");
    let fechacomanda = fecha.substr(0, 10);
    return {
      products: this.props.data,

      documentTitle: "COMANDA", //Defaults to INVOICE

      currency: "USD",
     
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,

        sender: {
        company: "Distri Pollo",
        address: "Eudoro Araoz 933",
        zip: "CP 4000",
        city: "SM de Tucumán",
        country: "Tucumán",

      },
      client: this.props.datacli,

      information: {
        number: this.props.datacomanda[0].nrodecomanda,
        date: fechacomanda,
       
      },

      bottomNotice: "Gracias por su Compra...",
 
      translate: {
        invoice: "COMANDA",
        number:"Nro de comanda",
        date: "Fecha Comanda",
        "due-date":"No valido como factura!",
        products: "Producto/Servicio",
        quantity: "Cantidad",
        price: "Precio Unit",
        total: "Total",
      },

    };
  }
}

export default EasyInvoiceSample;
