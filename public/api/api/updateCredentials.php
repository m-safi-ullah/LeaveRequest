<?php
include 'DbConnect.php';

$dbConnection = new DbConnect();
$conn = $dbConnection->db();
if (!$conn) {
    die("Database connection failed");
}

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case "POST":
        try {
            $user = json_decode(file_get_contents('php://input'), true);
            $portal = $_GET['portal'];
            if($portal=== 'Admin'){
                $sql = "UPDATE adminlogin SET adminEmail = :adminEmail, adminPass = :adminPass";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':adminEmail', $user['adminEmail']);
                $stmt->bindParam(':adminPass', $user['adminPassword']);
            }
            else if($portal === 'Approver')
            {
                $sql = "UPDATE leaveapprover SET approverEmail = :ApproverEmail, approverPass = :ApproverPassword WHERE approverEmail = :ApproverEmail";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':ApproverEmail', $user['ApproverEmail']);
                $stmt->bindParam(':ApproverPassword', $user['ApproverPassword']);
            }
            else{
                $sql = "UPDATE emplogin SET empEmail = :EmployeeEmail, empPass = :EmployeePassword WHERE empEmail = :EmployeeEmail";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':EmployeeEmail', $user['EmployeeEmail']);
                $stmt->bindParam(':EmployeePassword', $user['EmployeePassword']);
            }

            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Successfully.'];
                echo json_encode($response);
            } else {
                $response = ['status' => 0, 'message' => 'Failed to update admin credentials.'];
                echo json_encode($response);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;
}
?>
