let { init, jobs } = require("../index.js");

describe("/jobs/", () => {
  let server;
  let oldJobList;

  beforeEach(async () => {
    oldJobList = jobs;
    server = await init();
  });

  afterEach(async () => {
    jobs = oldJobList;
    await server.stop();
  });

  describe("GET", () => {
    it("should return an array of jobs", async () => {
      const res = await server.inject({
        method: "get",
        url: "/jobs/",
      });

      expect(res.statusCode).toBe(200);
      expect(typeof res.result.length).toBe("number");
    });
  });

  describe("GET /:id", () => {
    it("should return a job if valid id is provided", async () => {
      const testJob = {
        id: "8cbdd2b0-7055-40d3-8f2d-ba9b38gb3d1e",
        type: "ON_DEMAND",
        priceInPence: "10000",
        contactEmail: "test@test.com",
        status: "ASSIGNED",
        createdAt: new Date("2020-06-01").toISOString(),
        updatedAt: null,
      };
      jobs.push(testJob);

      const res = await server.inject({
        method: "get",
        url: "/jobs/8cbdd2b0-7055-40d3-8f2d-ba9b38gb3d1e",
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.result)).toEqual(testJob);
    });

    it("should return 404 if job is not found", async () => {
      const res = await server.inject({
        method: "get",
        url: "/jobs/8cbdd",
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("PATCH /:id", () => {
    it("should update a job if valid id, email & status are provided", async () => {
        const testJob = {
            id: "8cbdd2b0-7055-40d3-8f2d-ba9b38gbb31p",
            type: "ON_DEMAND",
            priceInPence: "10000",
            contactEmail: "test@test.com",
            status: "ASSIGNED",
            createdAt: new Date("2020-06-01").toISOString(),
            updatedAt: null,
          };
          jobs.push(testJob);
    

      const res = await server.inject({
        method: "patch",
        url: "/jobs/8cbdd2b0-7055-40d3-8f2d-ba9b38gbb31p",
        payload:{
            contactEmail: "test2@test.com",
            status: "ASSIGNED",
        }
      });

      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.result).contactEmail).toBe("test2@test.com");
    });

    it("should return 404 if job is not found", async () => {
      const res = await server.inject({
        method: "patch",
        url: "/jobs/8cbdd",
        payload:{
            contactEmail: "test2@test.com",
            status: "ASSIGNED",
        }
      });
      expect(res.statusCode).toBe(404);
    });

    it("should return 400 if contactEmail or status are not the correct format", async () => {
        const res = await server.inject({
          method: "patch",
          url: "/jobs/8cbdd",
          payload:{
              contactEmail: "a",
              status: "a",
          }
        });
        expect(res.statusCode).toBe(404);
      });


  });


});
