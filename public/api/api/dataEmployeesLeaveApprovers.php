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
            $portal = $_GET['portal'];
            if($portal == 'Approver')
            {
                $sql = "INSERT INTO leaveapprover (approverName, approverEmail,approverPass)
                    VALUES (:AppName, :AppEmail,:AppPass)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':AppName', $_POST['AppName']);
                $stmt->bindParam(':AppEmail', $_POST['AppEmail']);
                $stmt->bindParam(':AppPass', $_POST['AppPass']);
            }
            else{
                $sql = "INSERT INTO emplogin (empName, empEmail, empPass)
                    VALUES (:empName, :empEmail, :empPassword)";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':empName', $_POST['empName']);
                $stmt->bindParam(':empEmail', $_POST['empEmail']);
                $stmt->bindParam(':empPassword',$_POST['empPassword']);
            }
            
            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Successfully.'];
                echo json_encode($response);
            } else {
                $response = ['status' => 0, 'message' => 'Failed to create record.'];
                echo json_encode($response);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;
        case "GET":
            try {
                $portal = $_GET['portal'];
                
                if($portal == 'Approver'){
                    $sql = "SELECT * FROM leaveapprover";
                    $stmt = $conn->prepare($sql);
                }
                else if($portal == 'Employee'){
                    $sql = "SELECT * FROM emplogin";
                    $stmt = $conn->prepare($sql);
                }
                else{
                    $sql = "SELECT empID, empEmail,empName FROM emplogin";
                    $stmt = $conn->prepare($sql);
                }
                if ($stmt->execute()) {
                    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
                    $response = ['status' => 1, 'data' => $data];
                    echo json_encode($response);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
            }
            break;

        case "DELETE":
            
            try {
                $user = json_decode(file_get_contents('php://input'), true);
                $portal = $_GET['portal'];
                if($portal == 'Approver'){
                    $sql = "DELETE FROM leaveapprover WHERE approverID=:appID";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':appID', $user['appID']);   
                }
                else if($portal == 'Employee'){
                    $sql = "DELETE FROM emplogin WHERE empID=:empID";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':empID', $user['empID']);
                }
                if ($stmt->execute()) {
                    $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
                    echo json_encode($response);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
            }
            break;
        
}
?>
