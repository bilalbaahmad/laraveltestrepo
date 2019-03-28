<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use function MongoDB\BSON\toJSON;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

use PhpOffice\PhpSpreadsheet\Chart\Chart as Chart;
use PhpOffice\PhpSpreadsheet\Chart\DataSeries;
use PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues;
use PhpOffice\PhpSpreadsheet\Chart\Legend;
use PhpOffice\PhpSpreadsheet\Chart\PlotArea;
use PhpOffice\PhpSpreadsheet\Chart\Title;
use PhpOffice\PhpSpreadsheet\Spreadsheet as spreadsheet;
use PhpOffice\PhpSpreadsheet\IOFactory;



class ChartController extends Controller
{
    public function index()
    {
        /*$role = Role::create(['name' => 'admin']);
        $role = Role::create(['name' => 'pdf downloader']);
        $role = Role::create(['name' => 'excel downloader']);*/

        /*$permission = Permission::create(['name' => 'export pdf']);
        $permission = Permission::create(['name' => 'export excel']);*/

        /*$all_permissions = Permission::all();
        $excel_perm = Permission::findByName('export excel');
        $pdf_perm = Permission::findByName('export pdf');

        $admin_role = Role::findByName('admin');
        $excel_role = Role::findByName('excel downloader');
        $pdf_role = Role::findByName('pdf downloader');

        $admin_role->syncPermissions($all_permissions);
        $excel_role->givePermissionTo($excel_perm);
        $pdf_role->givePermissionTo($pdf_perm);*/

        /*$pdf_role = Role::findByName('pdf downloader');
        auth()->user()->assignRole($pdf_role);*/

        /*$permissions = auth()->user()->getAllPermissions();
        return  $permissions->tojson();*/

        return view('welcome');
    }

    public function viewexcel()
    {
        $spreadsheet = new spreadsheet();

        //create an excel worksheet and add some data for chart
        $worksheet = $spreadsheet->getActiveSheet();
        $worksheet->fromArray([
            ['', 2010, 2011, 2012],
            ['Q1', 12, 15, 21],
            ['Q2', 56, 73, 86],
            ['Q3', 52, 61, 69],
            ['Q4', 30, 32, 0],
        ]);

        //Set the Labels for each data series we want to plot
        // Datatype
        // Cell reference for data
        // Format Code
        // Number of datapoints in series
        // Data values
        // Data Marker
        $dataSeriesLabels = [
            new \PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues('String', 'Worksheet!$C$1', null, 1), //  2011
        ];

        //Set the X-Axis Labels
        // Datatype
        // Cell reference for data
        // Format Code
        // Number of datapoints in series
        // Data values
        // Data Marker
        $xAxisTickValues = [
            new \PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues('String', 'Worksheet!$A$2:$A$5', null, 4), //  Q1 to Q4
        ];

        //Set the Data values for each data series we want to plot
        // Datatype
        // Cell reference for data
        // Format Code
        // Number of datapoints in series
        // Data values
        // Data Marker
        $dataSeriesValues = [
            new \PhpOffice\PhpSpreadsheet\Chart\DataSeriesValues('Number', 'Worksheet!$C$2:$C$5', null, 4),
        ];

        //  Build the dataseries
        $series = new \PhpOffice\PhpSpreadsheet\Chart\DataSeries(
            \PhpOffice\PhpSpreadsheet\Chart\DataSeries::TYPE_PIECHART, // plotType
            null, // plotGrouping (Pie charts don't have any grouping)
            range(0, count($dataSeriesValues) - 1), // plotOrder
            $dataSeriesLabels, // plotLabel
            $xAxisTickValues, // plotCategory
            $dataSeriesValues          // plotValues
        );

        //  Set up a layout object for the Pie chart
        $layout = new \PhpOffice\PhpSpreadsheet\Chart\Layout();
        $layout->setShowVal(true);
        $layout->setShowPercent(true);
        $layout->setShowBubbleSize(true);
        $layout->setShowLeaderLines(true);

        //  Set the series in the plot area
        $plotArea = new \PhpOffice\PhpSpreadsheet\Chart\PlotArea($layout, [$series]);
        //  Set the chart legend
        $legend = new \PhpOffice\PhpSpreadsheet\Chart\Legend(\PhpOffice\PhpSpreadsheet\Chart\Legend::POSITION_RIGHT, null, false);

        $title = new \PhpOffice\PhpSpreadsheet\Chart\Title('Test Pie Chart');

        //  Create the chart
        $chart = new Chart(
            'chart', // name
            $title, // title
            $legend, // legend
            $plotArea, // plotArea
            true, // plotVisibleOnly
            0, // displayBlanksAs
            null, // xAxisLabel
            null   // yAxisLabel    - Pie charts don't have a Y-Axis
        );

        //Set the position where the chart should appear in the worksheet
        $chart->setTopLeftPosition('A7');
        $chart->setBottomRightPosition('H20');

        //Add the chart to the worksheet
        $worksheet->addChart($chart);

        //Save Excel 2007 file
        $randname = 'Test'.gmdate('Y-m-d H:s:i').'.xlsx';
        $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->setIncludeCharts(true);
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename='.$randname);
        $writer->save("php://output");
    }
}
