const request = require("supertest")("https://kasir-api.belajarqa.com");
const expect = require("chai").expect;
var token="";
var tokensalah="";

describe ("Login", function() {
    it ("Sukses Login", async function(){
        const response = await request.post("/authentications")
        .send(
            {
                email: "annisa@gmail.com",
                password: "1234567890"
            });
            expect(response.status).to.eql(201);
            token = response.body.data.accessToken;
});

    it("Gagal Login", async function(){
        const response = await request.post("/authentication")
        .send(
            {
                email: "test@gmail.com",
                password: "1234"
            }
        );
        expect(response.status).to.eql(404);
    })

    it("Add Customer", async function (){
        const response = await request.post("/customers")
        .set("Authorization", `Bearer ${token}`)
        .send(
            {
                "name": "Budi",
                "phone": "081234567890",
                "address": "Bandoeng",
                "description": "Budi anak Pak Edi"
            }
        );
            expect(response.status).to.eql(201);
            const data = response.body.data;
            const isValid = isUUID(data.customerId);
            expect(isValid).to.be.true;
            idcustom = response.body.data.customerId
    })
        function isUUID(str) {
        const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidPattern.test(str);
      }
    it("Add Customer", async function (){
        const response = await request.post("/customers")
        .set("Authorization", `Bearer ${tokensalah}`)
        .send(
            {
                "name": "Budi",
                "phone": "081234567890",
                "address": "Bandoeng",
                "description": "Budi anak Pak Edi"
            }
        );
            expect(response.status).to.eql(401);
    })

    it("Get Customer Detail", async function(){
        const response = await request.get(`/customers/${idcustom}`)
        .set("Authorization", `Bearer ${token}`)
        .send();
        expect(response.status).to.eql(200);
    })

    it("Get Customer Detail", async function(){
        const response = await request.get(`/customers/${idcustom}`)
        .set("Authorization", `Bearer ${tokensalah}`)
        .send();
        expect(response.status).to.eql(401);
    })

    it("Get Customer List", async function(){
        const response = await request.get("/customers?q=Budi&page=1")
        .set("Authorization", `Bearer ${token}`)
        .send();
        expect(response.status).to.eql(200);
        const body = response.body
        expect(body.status).to.eql('success')
        const customers = response.body.data.customers[0];
        expect (customers.name).to.eql('Budi')
    })

    it("Get Customer List", async function(){
        const response = await request.get("/customers?q=Annisa&page=1")
        .set("Authorization", `Bearer ${token}`)
        .send();
        expect(response.status).to.eql(200);
        const body = response.body
        expect(body.status).to.eql('success')
        const customers = response.body.data.customers[0];
        //expect (customers.name).to.eql('Budi')
    })
});