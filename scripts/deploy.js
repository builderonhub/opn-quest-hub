async function main() {

    const OPNPoints = await ethers.getContractFactory("OPNPoints");

    const opnPoints = await OPNPoints.deploy();

    await opnPoints.waitForDeployment();

    console.log(
        "Contract deployed to:",
        await opnPoints.getAddress()
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});