import frappe

@frappe.whitelist()
def get_dashboard_data():

    data = {}

    # Totals
    data["total_trips"] = frappe.db.count("Trip")
    data["vehicles"] = frappe.db.count("TMS Vehicle")
    data["drivers"] = frappe.db.count("TMS Driver")

    # Trip status
    data["running_trips"] = frappe.db.count(
        "Trip",
        {"trip_status": ["in", ["At Loading Point","Loaded","On the Way","Unloading"]]}
    )

    data["completed_trips"] = frappe.db.count(
        "Trip",
        {"trip_status": "Completed"}
    )

    data["planned_trips"] = frappe.db.count(
        "Trip",
        {"trip_status": "Planned"}
    )

    data["pending_billing"] = frappe.db.count(
        "Trip",
        {"billing_basis": "Not Billed"}
    )

    # Driver Status
    data["drivers_available"] = frappe.db.count(
        "TMS Driver",
        {"driver_status": "Available"}
    ) or 0

    data["drivers_on_trip"] = frappe.db.count(
        "TMS Driver",
        {"driver_status": "On Trip"}
    ) or 0

    data["drivers_leave"] = frappe.db.count(
        "TMS Driver",
        {"driver_status": "On Leave"}
    ) or 0

    # Vehicle Status
    data["vehicles_on_trip"] = frappe.db.count(
        "TMS Vehicle",
        {"vehicle_status": "On Trip"}
    ) or 0

    data["vehicles_empty"] = frappe.db.count(
        "TMS Vehicle",
        {"vehicle_status": "Empty"}
    ) or 0

    data["vehicles_maintenance"] = frappe.db.count(
        "TMS Vehicle",
        {"vehicle_status": "Maintenance"}
    ) or 0

    # Latest Trips
    data["latest_trips"] = frappe.get_all(
    "Trip",
    fields=[
        "name",
        "vehicle",
        "driver",
        "trip_status",
        "from",
        "to",
        "current_location"
    ],
    order_by="creation desc",
    limit=6
)

    return data
